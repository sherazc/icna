# Multi-Tenant Authentication & Authorization

How FaithfulPlanner authenticates users, isolates tenants (companies), and keeps
a browser session alive past the access token's 1hr lifetime using refresh
tokens. Written to double as a reference for future multi-tenant systems on
the same stack (PostgreSQL + Spring Boot/Kotlin + ReactJS + React Native).

Stack: Kotlin + Spring Boot (Spring Security OAuth2 Resource Server, hand-rolled
JWT issuance — **not** Spring Authorization Server), PostgreSQL + Spring Data
JPA + Flyway, ReactJS (Context + `useReducer`, native `fetch`, no axios/redux).

---

## 1. Backend

### 1.1 Entities

Tenant = **Company**. A user belongs to exactly one company.

```
Company (1) ──< UserProfile (N) >── m2m_user_profile_user_role ──< UserRole
```

- **`Company`** (`entity/Company.kt`, table `company`) — `id`, `companyName`
  (unique), `uiThemeId`, `active`. This is the tenant boundary — every
  `UserProfile` row has a `company_id` FK.
- **`UserProfile`** (`entity/UserProfile.kt`, table `user_profile`) — `id`,
  `email`, `userPassword` (BCrypt-hashed), `firstName`, `lastName`,
  `phoneNumber`, `@ManyToOne company`, `@ManyToOne employeeGroup`,
  `@ManyToMany userRoles` (EAGER — always loaded with the user, since roles
  are needed on every authenticated request), `@ManyToMany employeeTypes`.
  Uniqueness constraint is `(email, company_id)` — **the same email can exist
  in two different companies as two unrelated users.** This is the crux of
  tenant isolation at the data layer.
- **`UserRole`** (`entity/UserRole.kt`, table `user_role`) — just `id` +
  `roleName` (`BASIC_USER` / `ADMIN` / `MASTER`). Global, not per-company —
  the three roles are shared reference data, not tenant-scoped rows.
- **`m2m_user_profile_user_role`** — join table, composite PK
  (`user_profile_id`, `user_role_id`).

Migration: `api/src/main/resources/db/migration/V1_0_0__user_auth.sql`.

### 1.2 Repositories & Services

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/CompanyRepository.kt` | CRUD + `findActive()` |
| Repository | `repository/UserProfileRepository.kt` | All queries are **explicitly scoped by `companyId`** (`findByCompanyIdAndEmail`, `findByCompanyId`, `findByCompanyIdAndEmployeeGroupId`, etc.) — company scoping is a query parameter, not automatic. |
| Repository | `repository/UserRoleRepository.kt` | `findByRoleName` |
| Service | `service/CompanyService.kt` | Create/lookup companies; validates company name uniqueness |
| Service | `service/UserProfileService.kt` | User CRUD, registration, password update, all takes explicit `companyId` params passed through from controllers |
| Service | `service/UserRoleService.kt` | `addRole(userProfile, AuthRole)` — idempotent role grant |
| Service | `service/RegistrationSaveService.kt` | **Tenant provisioning**: creates a `Company` + first `UserProfile` in one `@Transactional` call, grants that user both `BASIC_USER` and `ADMIN` (see 1.6) |

### 1.3 Spring Security Configuration

`configuration/SecurityConfiguration.kt` — key points:

```kotlin
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, jsr250Enabled = true, securedEnabled = false, mode = AdviceMode.PROXY)
class SecurityConfiguration(@Value("${jwt.key}") private var jwtKey: String) {

    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain = http
        .cors {  }
        .csrf { it.disable() }                         // stateless JWT API, no CSRF-vulnerable cookie auth
        .authorizeHttpRequests { it.anyRequest().permitAll() }  // <-- see note below
        .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
        .oauth2ResourceServer { oauth2 -> oauth2.jwt { it.jwtAuthenticationConverter(getJwtAuthenticationConverter()) } }
        .httpBasic { }
        .build()
    ...
}
```

**Important:** `authorizeHttpRequests { anyRequest().permitAll() }` means the
filter chain itself authorizes *nothing*. All real authorization happens via
**method-level `@PreAuthorize`** on individual controller methods
(`@EnableMethodSecurity` is what turns this on). An endpoint with no
`@PreAuthorize` is open to anyone who can reach it — this is deliberate for
`/api/login/token` (needs Basic auth to even authenticate, checked inside the
method) and `/api/login/refresh` (the refresh token itself is the credential,
validated in the service layer, not via Spring Security).

- **`jwtDecoder()`** — builds a `NimbusJwtDecoder` with `HmacSHA512`, keyed by
  `jwt.key` (`application.properties`). Used by the resource-server filter to
  validate the signature/expiry of every incoming `Authorization: Bearer`
  header.
- **`jwtEncoder()`** — `NimbusJwtEncoder` with the same secret, used only by
  `ScTokenGeneratorService` to *mint* tokens.
- **`getJwtAuthenticationConverter()`** — maps the JWT's `roles` claim into
  `SimpleGrantedAuthority` objects, which is what makes
  `hasAnyAuthority(...)` in `@PreAuthorize` expressions work against JWT-based
  requests.
- **`corsConfigurationSource()`** — `allowedOriginPatterns = "*"`,
  `allowCredentials = true`. Permissive by default; **tighten this per
  deployment** for a real multi-tenant production system (see §5).
- **`.httpBasic {}`** — only exercised by `/api/login/token`; every other
  endpoint relies purely on the JWT resource-server filter.

### 1.4 Roles — `AuthRole`

`service/model/AuthRole.kt`:

```kotlin
enum class AuthRole { BASIC_USER, ADMIN, MASTER }
```

Roles are assigned per `UserProfile` via the `m2m_user_profile_user_role`
table (`UserRoleService.addRole`), but **role checks in code use a computed
hierarchy, not just the raw DB rows** — see `ScSecurityUserDetailService.getRoles()`
(§1.8):

```kotlin
val additionalRoles = when {
    AuthRole.MASTER.toString() in dbRoles -> AuthRole.entries.map { it.toString() }   // MASTER implies everything
    AuthRole.ADMIN.toString()  in dbRoles -> listOf(AuthRole.BASIC_USER.toString())   // ADMIN implies BASIC_USER
    else -> emptyList()
}
```

So a user only ever needs `MASTER` or `ADMIN` stored in the DB — `BASIC_USER`
is implied and computed at login/refresh time, not stored redundantly. These
computed roles are what get embedded in the JWT's `roles` claim, and are what
`@PreAuthorize("hasAnyAuthority(...)")` and the React `Authenticated`
component both check.

`@PreAuthorize` expressions reference the enum directly rather than string
literals, so a typo doesn't silently create a role that matches nothing:

```kotlin
@PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
```

### 1.5 Company Isolation

Isolation is enforced in **two different, independent ways** — one strong,
one weaker. Understanding both matters for any future multi-tenant system on
this stack.

**a) At authentication (strong).** The Basic-auth *username* is not just an
email — it's `"{companyId}/{email}"`, built by the frontend
(`ApiClinic.ts login()`: `btoa(\`${companyId}/${email}:${password}\`)`).
`ScSecurityUserDetailService.loadUserByUsername()` parses that format and
looks the user up **scoped to that companyId**:

```kotlin
val userNameParts = username.split("/")
val companyId = userNameParts[0].trim().toLong()
val email = userNameParts[1].trim()
userProfileService.findByCompanyIdAndEmail(companyId, email)
```

So two different companies can each have a `jane@example.com` user, and
logging in as one never authenticates as the other — the company is part of
the credential, not just a claim asserted afterward. Once authenticated, the
user's `companyId` is embedded in the JWT (`JwtClaim.companyId`) and returned
in `AuthUserTokenDto`.

**b) On subsequent API calls (weaker — a known gap, not a design goal).**
Endpoints like `GET /api/company/{companyId}/user-profile/{userProfileId}`
take `companyId` as a **path variable**, and `@PreAuthorize` only checks role
membership (`hasAnyAuthority(BASIC_USER)`), never that the JWT's own
`companyId` claim matches the `{companyId}` in the URL. The query layer
(`UserProfileRepository.findByCompanyId(companyId)`) trusts whatever
`companyId` is in the path. In practice this isn't exploitable through the
UI, since the frontend always sends the logged-in user's own
`authUserToken.companyId` — but nothing server-side stops an authenticated
user of Company A from substituting Company B's ID in the URL and reading
Company B's data. **For a future multi-tenant system, this is the first
thing to fix** — e.g., a shared `@PreAuthorize` expression or a
`HandlerInterceptor` that rejects any request where `{companyId}` in the path
doesn't match `jwt.getClaimAsString("companyId")`.

### 1.6 Tenant Provisioning

`RegistrationController` → `RegistrationSaveService.saveNewRegistration()`
(one `@Transactional` method) creates a brand-new tenant:

1. `companyService.saveCompany(...)` — inserts the `Company` row.
2. `userProfileService.saveRegistrationAdmin(company, user)` — inserts the
   first `UserProfile` for that company and grants it **both**
   `BASIC_USER` and `ADMIN` (`UserRoleService.addRoles(...)`), so the person
   who registers an organization can immediately manage it.

There's no `MASTER` role granted anywhere in this flow — that role appears to
be reserved for manually-elevated super-admin accounts (it isn't assigned by
any code path in this codebase; presumably granted directly in the DB when
needed).

### 1.7 LoginController — Login & Refresh

`controller/LoginController.kt`:

```kotlin
@RestController
@RequestMapping("/api/login")
class LoginController(private val scTokenGeneratorService: ScTokenGeneratorService) {

    @GetMapping("/token")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun token(authentication: Authentication): AuthUserTokenDto
        = scTokenGeneratorService.generateToken(authentication)

    @PostMapping("/refresh")
    fun refresh(@Valid @RequestBody request: RefreshTokenRequestDto): AuthUserTokenDto
        = scTokenGeneratorService.refreshToken(request.refreshToken)
}
```

- **`GET /api/login/token`** — authenticated via `.httpBasic{}` (username
  `companyId/email`, password the plaintext password checked against the
  BCrypt hash). `@PreAuthorize(BASIC_USER)` runs *after* Basic auth succeeds
  and the user's roles are loaded — effectively "any successfully
  authenticated user." Delegates to `ScTokenGeneratorService.generateToken()`.
- **`POST /api/login/refresh`** — deliberately has **no `@PreAuthorize`**.
  The refresh token in the request body *is* the credential; it's validated
  by hash-lookup inside `ScTokenGeneratorService.refreshToken()`, not by
  Spring Security. It falls through as open access because of the
  filter-chain's `permitAll()` (§1.3) — the endpoint would be reachable even
  with an expired or missing access JWT, which is the whole point.

### 1.8 DTOs

- **`AuthUserTokenDto`** (`dto/AuthUserTokenDto.kt`) — the response shape for
  both login and refresh:
  ```kotlin
  class AuthUserTokenDto(
      val userProfileId: Long, 
      val companyId: Long, 
      val companyName: String,
      val subject: String, 
      val issuedAtUtc: LocalDateTime, 
      val expiresAtUtc: LocalDateTime,
      val roles: List<String>, 
      val token: String, 
      val refreshToken: String)
  ```
- **`RefreshTokenRequestDto`** (`dto/RefreshTokenRequestDto.kt`) — the
  refresh request body, just `refreshToken: String` with `@field:NotBlank`.
- **`UserProfileUserDetails`** (`dto/UserProfileUserDetails.kt`) — implements
  Spring Security's `UserDetails`; wraps a `UserProfileDto` + resolved role
  list. `getCompanyId()`/`getUserProfileId()` are how
  `ScTokenGeneratorService.generateToken()` pulls tenant/user identity out of
  the authenticated principal to embed in the JWT.

### 1.9 `com.sc.clinic.service.security` package

| Class | Role |
|---|---|
| `ScSecurityUserDetailService` (`UserDetailsService`) | Parses `companyId/email` username, loads the `UserProfile` **scoped to that company**, computes the effective role list (MASTER/ADMIN hierarchy, §1.4). This is the tenant-isolation choke point for login. |
| `ScTokenGeneratorService` | Builds JWT access tokens (`generateToken()`, called from login) and handles refresh token issuance/rotation/validation (`refreshToken()`, called from `/api/login/refresh`). See §1.10. |
| `PermissionValidator` | `validateSelfOrHasRoles(selfUserProfileId, selfRoles, targetUserProfileId, requiredRoles)` — the "you can act on your own record, or you need role X" pattern used for profile edits and password changes. Throws `ScException` (→ 500; arguably should be a 403, worth revisiting) if neither condition holds. |
| `PasswordValidator` | Minimum length check (5 chars) used on registration/password-update. |

### 1.10 Refresh Token Mechanics

Table `refresh_token` (`V1_0_0__user_auth.sql`):

```sql
create table refresh_token (
    id bigserial not null primary key,
    user_profile_id bigint not null references user_profile(id),
    token_hash varchar(255) not null unique,
    expires_at timestamp not null,
    revoked_at timestamp,
    created_at timestamp not null default now()
);
```

`ScTokenGeneratorService`:

- **On login or refresh**, `buildAuthUserToken()` mints a new 1hr access JWT
  *and* calls `issueRefreshToken()`: 32 random bytes (`SecureRandom`),
  base64url-encoded → returned to the client raw, but only the
  **SHA-256 hash** is stored in `refresh_token.token_hash`. The raw value
  never touches the database.
- **`refreshToken(value)`** (called by `/api/login/refresh`): hashes the
  incoming value, looks it up by `token_hash`, rejects (`ScBadRequestException`
  → 400) if not found, already `revoked_at`, or past `expires_at`. If valid,
  it **rotates**: marks the old row `revoked_at = now()`, then mints a
  completely fresh access JWT + a brand-new refresh token via the same
  `buildAuthUserToken()` path used at login (so the response shape and roles
  computation is identical either way). Refresh tokens are single-use by
  design — presenting one twice fails on the second attempt with "revoked."
- **TTL**: access JWT 1hr (hardcoded, `ScTokenGeneratorService`); refresh
  token 14 days (`REFRESH_TOKEN_TTL_DAYS` constant, same file).
- **Cleanup**: `service/security/RefreshTokenCleanupService.kt` runs a daily
  `@Scheduled(cron = "0 0 3 * * *")` job (`@EnableScheduling` turned on in
  `Application.java`) that deletes every row where `expiresAt` is in the past
  **or** `revokedAt` is non-null:
  ```kotlin
  @Query("delete from RefreshToken rt where rt.expiresAt < :expiredBefore or rt.revokedAt is not null")
  fun deleteExpiredOrRevoked(expiredBefore: LocalDateTime): Int
  ```
  `revokedAt` is treated purely as a flag here (non-null = no longer valid,
  safe to delete), not as a retention timestamp — there's no code anywhere in
  this app that reads *how long ago* a token was revoked, so keeping revoked
  rows around for some grace period would only add an unused column of
  complexity. If a future system adds real security-incident tooling (e.g.
  alerting on replayed-revoked-token attempts), that's the point to
  reconsider a short retention window before deleting revoked rows — not
  before.

---

## 2. Frontend — ReactJS (Web)

### 2.1 API Client Configuration

Three layers, low-level to high-level:

- **`service/api/ApiFetchWrapper.ts`** — thin wrapper over native `fetch`.
- **`service/api/ApiCore.ts`** — `callApi(request)` does the actual fetch and
  resolves JSON on `200` / rejects with response text otherwise.
  `callApiIntercept(request, interceptorCbs)` wraps that with `before`/
  `afterSuccess`/`afterError` hooks **and** the 401-retry logic (§2.4).
- **`service/api/ApiClinic.ts`** — `clinicApis(commonHeaders?, interceptorCbs?)`
  returns an object of typed API methods (`getAllCompanies`, `login`,
  `refreshToken`, `saveRegistration`, ...). `commonHeaders` — typically the
  `Authorization: Bearer <token>` header built by `createAuthHeader()` — is
  captured in a closure at construction time and applied to every method via
  `addHeadersInRequest()`.

Authentication plugs in structurally, not as a runtime lookup: whenever the
access token changes (login, refresh, or logout), a **new** `clinicApis(...)`
instance is built with the current header baked in, and that instance
replaces the one in `AppContext` (`clinicApisReducer.ts`,
`ActionNameClinicApis.updateClinicApis`). Every component reads
`clinicApis` from context, so they automatically get whichever
header-bearing instance is current — no per-call token lookup needed.

### 2.2 Auth DTOs

`service/service-types.ts`:

```ts
export type AuthUserTokenDto = {
    userProfileId: number; 
    companyId: number; 
    companyName: string;
    subject: string; 
    issuedAtUtc: string; 
    expiresAtUtc: string;
    roles: AuthRole[]; 
    token: string; 
    refreshToken: string;
};
export type AuthRole = 'BASIC_USER' | 'ADMIN' | 'MASTER';
```

Mirrors the backend `AuthUserTokenDto` field-for-field — this is the single
object that flows through login, refresh, `AppContext`, and `localStorage`.

### 2.3 Login & Refresh Calls

`ApiClinic.ts`:

```ts
login: (loginRequest: LoginRequest): Promise<AuthUserTokenDto> => {
  const request: ApiRequest = { 
    endpoint: epLoginToken(), 
    skipAuthRetry: true 
    };
  addHeadersInRequest(request, [["Authorization", `Basic ${btoa(\`${companyId}/${email}:${password}\`)}\`]]);
  return callApiIntercept(request, interceptorCbs);
},
refreshToken: (refreshToken: string): Promise<AuthUserTokenDto> => {
  const request: ApiRequest = {
    endpoint: epLoginRefresh(), 
    method: "POST",
    payload: { refreshToken }, 
    headers: CONTENT_JSON_HEADER(), 
    skipAuthRetry: true
  };
  return callApiIntercept(request, interceptorCbs);
},
```

Both set **`skipAuthRetry: true`** — neither call should ever trigger the
401-retry machinery on itself (a failed login is just bad credentials, not an
expired session; and the refresh endpoint failing means "log the user out,"
not "try to refresh again").

`Login.tsx` calls `clinicApis.login(...)`, then dispatches
`ActionNameAuthUser.authUserLogin` with the returned DTO and rebuilds
`clinicApis` with the new Bearer header via `updateClinicApis` — this is the
same pair of dispatches the refresh coordinator (§2.4) replays on every
silent refresh.

### 2.4 The Full Request / Refresh Flow

**Why a coordinator, not a naive "catch 401, refresh, retry":** refresh
tokens rotate (single-use, §1.10). If several API calls expire at once and
each independently calls `/api/login/refresh`, only the first succeeds and
revokes the shared refresh token — the rest would then fail with "revoked"
and incorrectly log the user out. So exactly **one** refresh must be in
flight at a time, shared by every concurrent 401.

New module: **`service/api/TokenRefreshCoordinator.ts`** — a plain
(non-React) singleton holding the one in-flight refresh promise, plus a
`dispatch`/`navigate` pair wired in once at startup. It registers itself into
`ApiCore.ts` via `registerUnauthorizedHandler()`, so the low-level HTTP layer
never has to import anything about tokens, context, or routing —
dependency direction is one-way: `TokenRefreshCoordinator → ApiCore`,
`TokenRefreshCoordinator → ApiClinic`, and nothing imports
`TokenRefreshCoordinator` except the wiring hook (§2.5). This avoids a
circular-import cycle that a more naive design would hit.

**Path 1 — a normal call, token still valid:**

```
Component ──▶ clinicApis.someMethod() ──▶ callApiIntercept ──▶ callApi ──▶ fetch (Bearer <token>) ──▶ 200 ──▶ resolves
```

**Path 2 — concurrent 401s, refresh succeeds:**

```
COMPONENTS                API LAYER (ApiCore/ApiClinic)     TokenRefreshCoordinator          AppContext / reducers        BACKEND
----------                -----------------------------     ------------------------          --------------------        -------

Dashboard mounts, fires 3 calls in parallel:
 getAllCompanies() ──────▶ callApi ─────────────────────────────────────────────────────────────────────────────▶ GET /api/company
 getEmployeeGroups()─────▶ callApi ─────────────────────────────────────────────────────────────────────────────▶ GET .../employee-group
 getOperationDay() ──────▶ callApi ─────────────────────────────────────────────────────────────────────────────▶ GET .../operation-day
                                                                                                     (JWT expired)
                           ◀──────────────────────────────────────────────────────────── 401 ◀── 401 ◀── 401 ──────┘

 each callApi records response.status on request.lastStatus, callApiIntercept
 sees 401 (and !skipAuthRetry) — does NOT reject to the caller yet:
                           unauthorizedHandler() ─────────────▶ getRefreshedAuthHeader()
                                        │
                     1st arrival ──────▶ no in-flight promise ─▶ create it:
                                          refreshPromise = clinicApis().refreshToken(currentRefreshToken)
                                                                        │
                                                                        ▼
                                                                 POST /api/login/refresh ─────────────────────────▶ Backend
                     2nd arrival ──────▶ in-flight promise exists ─▶ just awaits the SAME promise (no new HTTP call)
                     3rd arrival ──────▶ same, awaits the same promise
                                                                        ◀───────── 200 new AuthUserTokenDto ───────┘
                                        refreshPromise resolves:
                                          dispatch(authUserLogin, newDto) ───────▶ authUserToken updated,
                                                                                    localStorage updated
                                          dispatch(updateClinicApis, newHeader) ─▶ clinicApis rebuilt w/ new Bearer
                                        in-flight promise cleared (null)

 each of the 3 original callApiIntercept calls wakes up, replaces the
 Authorization header on its own request object, retries ONCE:
 GET /api/company            (Bearer <new>) ──▶ 200 ──▶ resolves to Dashboard
 GET .../employee-group      (Bearer <new>) ──▶ 200 ──▶ resolves
 GET .../operation-day       (Bearer <new>) ──▶ 200 ──▶ resolves

Dashboard renders normally — no visible interruption, no redirect.
```

**Path 3 — refresh token itself is dead (expired/revoked/missing):**

```
                                        refreshPromise = clinicApis().refreshToken(...) ──▶ Backend
                                                                                              hash lookup: revoked/expired
                                        ◀────────────────── 400 "refresh token expired/revoked" ──┘
                                        refreshPromise REJECTS

 all 3 waiting callApiIntercept calls reject too — NO retry attempted

                                        TokenRefreshCoordinator's failure handler fires ONCE
                                        (triggered by the shared promise settling, not by each caller):
                                          dispatch(authUserLogout) ─────────────▶ authUserToken cleared,
                                                                                   localStorage cleared
                                          dispatch(updateClinicApis, noHeader) ─▶ clinicApis reset to anonymous
                                          navigate("/")  ──▶ react-router pushes user to Login screen

 Dashboard's 3 data calls end as rejected promises; components render empty
 state briefly, since navigation away happens almost immediately.

 Safety net: Authenticated.tsx / UnAuthRedirect.tsx re-check isAuthenticated()
 on every render — any other still-mounted screen also redirects once
 authUserToken is cleared, even if it wasn't the one that triggered the 401.
```

**Guard against a doom loop:** `getRefreshedAuthHeader()` checks for a
`refreshToken` value *before* calling the backend at all — if there isn't
one (e.g. a stray call fires just after logout), it fails immediately and
runs the same "failure" side effects, without an extra network round trip.

### 2.5 Wiring: how the coordinator gets `dispatch`/`navigate`

`TokenRefreshCoordinator.ts` is a plain module — it can't call
`useContext`/`useNavigate` itself. `hook/useAuthRefreshCoordinator.ts` bridges
this once:

```ts
export const useAuthRefreshCoordinator = () => {
  const [, dispatch] = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => { initTokenRefreshCoordinator(dispatch, navigate); }, [dispatch, navigate]);
}
```

Called from `layouts/Layout01.tsx` (the root element for every route, mounted
once for the app's lifetime), alongside the existing `useLoadCompanies()`.

### 2.6 Token Persistence — `AppContext` + `localStorage`

- **`service/token-storage.ts`** — `saveAuthUserToken` / `loadAuthUserToken` /
  `clearAuthUserToken`, thin wrappers around `localStorage` under the key
  `"authUserToken"`, storing the full `AuthUserTokenDto` as JSON.
- **`store/authUserReducer.ts`** — the single choke point for auth state
  changes. `authUserLogin` persists to `localStorage` as a side effect of the
  reducer; `authUserLogout` clears it. Every future dispatch of these action
  types (login, refresh, logout, from anywhere) gets persistence for free —
  callers never need to remember to persist separately.
- **`store/context.tsx`** — on module load (i.e. page refresh), reads
  `loadAuthUserToken()` synchronously and uses it as the initial
  `authUserToken` state. If it's a valid token, it *also* rebuilds the
  initial `clinicApis` instance with the Bearer header already attached
  (`createAuthHeader`) — restoring a fully working, authenticated API client
  immediately, not just the visible login state. Without this second part,
  a page refresh would show the user as "logged in" but every API call would
  silently go out unauthenticated.

**Deliberate tradeoff, revisit if the threat model changes:** the access
token (and now the refresh token) live in `localStorage`, which is readable
by any JS on the page — meaning an XSS bug could exfiltrate the refresh token
and impersonate the user for its full 14-day life. This was chosen over an
`HttpOnly` cookie specifically **because of the mobile requirement (§3)** —
`HttpOnly` cookies don't translate to React Native, and using one code path
across web + mobile was judged more valuable than the marginal security gain
for this app's risk profile. For a system with a higher security bar (e.g.
handling payment data), reconsider a hybrid: `HttpOnly` cookie for the web
client + body-delivered token for mobile.

---

## 3. Frontend — React Native (Mobile), Planned

Not yet built. This section captures the intended design so it's consistent
with the web implementation when it's built.

### 3.1 What stays identical to the ReactJS web app

Everything **backend-facing** is unchanged, because the backend has no
concept of "browser" vs "native app" — it just sees HTTP requests with a
Bearer header or a refresh-token body:

- `service/service-types.ts` (`AuthUserTokenDto`, `LoginRequest`, etc.) —
  copy as-is.
- `service/api/ApiCore.ts` — the `callApi`/`callApiIntercept`/
  `registerUnauthorizedHandler` machinery is framework-agnostic; React
  Native's `fetch` is API-compatible with the web `fetch` this relies on.
  Copy as-is.
- `service/api/ApiClinic.ts` — same endpoint definitions, same `login()` /
  `refreshToken()` methods, same `skipAuthRetry` flags. Copy as-is.
- `service/api/TokenRefreshCoordinator.ts` — the de-dupe-on-401 logic doesn't
  reference `window`, the DOM, or any browser API directly (aside from the
  storage read, see 3.2) — copy as-is.
- The overall **shape** of the flow in §2.4 (concurrent 401 → single
  coordinated refresh → retry; refresh failure → logout) is identical.

### 3.2 `localStorage` → `AsyncStorage` (or `SecureStore`)

The only web-specific piece is `service/token-storage.ts`, since
`localStorage` doesn't exist in React Native. Two swaps to consider:

- **`@react-native-async-storage/async-storage`** — closest drop-in, but it's
  **unencrypted** on-device storage (same security characteristics as
  `localStorage`, roughly — readable by anything with device/app-sandbox
  access, e.g. a rooted/jailbroken device or a backup extraction tool).
- **`expo-secure-store`** (Expo) or **`react-native-keychain`** (bare RN) —
  backed by iOS Keychain / Android Keystore, hardware-backed on most devices.
  **Recommended for the refresh token specifically**, since it's the
  long-lived, high-value credential (§1.10, §2.6) — mobile can actually do
  better here than a browser ever can.

The API surface stays the same shape, just async instead of sync:

```ts
// token-storage.native.ts
export const saveAuthUserToken = async (dto: AuthUserTokenDto): Promise<void> => {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(dto));
};
export const loadAuthUserToken = async (): Promise<AuthUserTokenDto> => { ... };
export const clearAuthUserToken = async (): Promise<void> => { ... };
```

The **one structural change this forces**: everywhere the web code calls
`loadAuthUserToken()` synchronously (`context.tsx`'s initial state,
`TokenRefreshCoordinator.getRefreshedAuthHeader()`), the mobile version has to
`await` it. `context.tsx`'s initial state currently reads the token
synchronously at module-eval time to compute `initialAppState` — on mobile
this becomes an async rehydration step (read storage in a `useEffect` after
first render, dispatch the loaded token in) rather than something available
before first paint. This is the standard React Native pattern (a brief
"restoring session" splash/loading state) and isn't a departure from anything
web-specific — it's just that `localStorage` happens to be synchronous and
`SecureStore`/`AsyncStorage` are not.

### 3.3 How refresh works on mobile

Structurally identical to §2.4 — same coordinator, same single-in-flight
promise, same rotation semantics on the backend. Two things differ in
practice:

- **No cookies involved either way** (we chose body-delivered refresh tokens
  for exactly this reason, §2.6) — so there's no `HttpOnly`/`SameSite`/CORS
  translation problem to solve for mobile at all. The mobile app receives the
  refresh token in the same JSON body as web, and stores it via
  `SecureStore`/Keychain instead of `localStorage`.
- **"Redirect to login" is a navigation action, not a URL change.** Web's
  `navigate("/")` (react-router) becomes whatever React Navigation's
  equivalent is (e.g. resetting the navigation stack to the auth flow) —
  `TokenRefreshCoordinator`'s `navigateFn` parameter is already an injected
  callback (`(path: string) => void`), so this is a matter of what function
  gets passed into `initTokenRefreshCoordinator()` at startup, not a change
  to the coordinator itself.

---

## 4. Applying This to a New Multi-Tenant System

Reusable, stack-independent pieces from this implementation:

- **Tenant-scoped login identity** (§1.5a) — encode the tenant ID into the
  authentication credential itself (here, `companyId/email` as the Basic
  auth username), not just as a claim checked after the fact. This is the
  strongest isolation guarantee in the system and should be the starting
  point for any new tenant-aware login.
- **Rotating, hashed, DB-backed refresh tokens** (§1.10) — opaque token,
  SHA-256 hash stored (never the raw value), single-use rotation, revocation
  timestamp for audit. This pattern is entirely framework-agnostic and
  ports directly to any Spring Boot + Postgres backend regardless of domain.
- **`skipAuthRetry` + a registered-handler seam between the generic HTTP
  layer and the auth layer** (§2.4) — keeps `ApiCore.ts` reusable
  boilerplate with zero auth-specific knowledge; only `ApiClinic.ts` /
  `TokenRefreshCoordinator.ts` need to be domain-specific per project.
- **Single-flight promise de-duping around token refresh** — worth carrying
  into any system using rotating refresh tokens, not just this one; without
  it, concurrent requests will intermittently and confusingly log users out.
- **Daily `@Scheduled` purge of expired/revoked refresh tokens** (§1.10) — a
  one-line JPQL delete plus a cron trigger, no extra infrastructure. Budget
  for this from day one on a new system rather than retrofitting it once the
  table's already grown unbounded.

Things to explicitly re-decide, not blindly copy, on the next system:

- **Company-ID path-variable validation (§1.5b).** This codebase does *not*
  cross-check `{companyId}` in the URL against the JWT's own `companyId`
  claim. Fix this from day one on a new system — e.g. a shared
  `@PreAuthorize` SpEL fragment or filter that every tenant-scoped controller
  reuses, rather than relying on "the frontend only ever sends its own ID."
- **`jwt.key` default value** (`application.properties`) is a checked-in
  placeholder string — fine for local dev, must be overridden via env-specific
  config for any real deployment. Same for `spring.datasource.password`.
- **CORS `allowedOriginPatterns = "*"`** — convenient during development,
  should be scoped to actual known origins once there's a real deployment
  domain (especially once mobile clients might use custom schemes /
  different origin rules).
- **`localStorage`-vs-`HttpOnly`-cookie tradeoff (§2.6)** — was decided here
  in favor of `localStorage` specifically because a React Native client was
  already planned. If a future system is web-only with no mobile client
  planned, the `HttpOnly` cookie approach is worth reconsidering instead —
  don't default to this system's choice without re-checking whether the same
  constraint (mobile compatibility) actually applies.
- **Role hierarchy is implicit, computed at login/refresh time**
  (`ScSecurityUserDetailService.getRoles()`, §1.4) rather than stored. This
  keeps the DB simple but means any new hierarchy rule requires a code
  change, not a data migration — acceptable at this scale (3 roles), worth
  reconsidering (e.g. a proper role-hierarchy table) if a future system needs
  many more roles or per-tenant custom roles.
