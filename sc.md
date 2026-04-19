**Senior Full-Stack Software Engineer** | Fiserv Global Business Services | October 2025 – Present

Architected and launched three mission-critical enterprise applications from ground zero, establishing event-driven infrastructure for payment device management and merchant data processing. Led full-stack development across Spring Framework/Boot backends, Apache Kafka event processing, and modern React frontends serving thousands of production devices.

**Key Contributions:**

• **Event-Driven Architecture** – Designed dual-region Kafka consumer infrastructure (AWS MSK North & Omaha) with SASL/SCRAM security, processing 100+ merchant events/minute through Oracle staging pipeline with distributed locking and <70 second end-to-end SLA

• **Full-Stack Engineering** – Built three production systems: FDPOS Services (Spring 6.2 + Kafka event processing), EstateWS (Spring Boot 4.0 microservice with RSA encryption & Apigee integration), EstateUI (React 19 + TypeScript administrative dashboard with BFF proxy layer)

• **Distributed Systems** – Implemented sophisticated concurrency patterns: database-level distributed locking (FOR UPDATE NOWAIT), multi-instance Tomcat cluster coordination, regional failure isolation, comprehensive message correlation tracking

• **Security & Scale** – Architected vendor-specific RSA encryption for payment terminals, HMAC-SHA256 request signing for API Gateway integration, comprehensive audit logging for compliance, supporting thousands of active devices

**Technical Stack:** Spring Framework 6.2, Spring Boot 4.0, React 19, TypeScript 5.7, Apache Kafka, Oracle/PostgreSQL, Hibernate 6.4, Java 17/21, AWS MSK, Aurora RDS
========

DOC 1

estate_management_design.md

# EstateWS - Architecture & Design Document

**Project Name:** EstateWS (Estate Management Web Service)  
**Version:** 0.0.1-SNAPSHOT  
**Organization:** Fiserv Global Business Services (GBS)  
**Team:** DL-NA-GBSTech-DevOps@fiserv.com  
**Documentation Date:** April 6, 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture](#architecture)
4. [Core Components](#core-components)
5. [Technology Stack](#technology-stack)
6. [Data Models](#data-models)
7. [API Endpoints](#api-endpoints)
8. [Security & Encryption](#security--encryption)
9. [Database Design](#database-design)
10. [Configuration & Deployment](#configuration--deployment)
11. [Error Handling](#error-handling)
12. [Audit & Logging](#audit--logging)
13. [Integration Points](#integration-points)
14. [Flow Diagrams](#flow-diagrams)

---

## Executive Summary

EstateWS is a **secure API key and device management microservice** built on Spring Boot that handles onboarding, provisioning, and lifecycle management of POS terminals and payment devices for Fiserv's estate management ecosystem. The service generates and manages cryptographically secured API credentials for devices, vendors, and clients, integrating with Apigee for API gateway services and CommerceHub for payment processing.

**Key Responsibilities:**
- Device/Terminal onboarding and registration
- Secure API key generation using Apigee
- RSA-based key encryption with vendor-specific public keys
- Client and Vendor credential management
- Comprehensive audit logging of all operations
- Scheduled synchronization with CommerceHub

---

## System Overview

### Purpose & Scope

EstateWS serves as the **central credential management hub** for Fiserv's payment device ecosystem. It acts as the bridge between:
- **Device Layer** - POS terminals and payment devices (Ingenico, etc.)
- **API Gateway Layer** - Apigee for API credential generation
- **Payment Processing Layer** - CommerceHub for transaction processing
- **Data Persistence Layer** - PostgreSQL Aurora RDS database

### Business Drivers

1. **Security** - Ensure only authorized devices access payment systems
2. **Scalability** - Support thousands of devices with unique credentials
3. **Compliance** - Maintain audit trails for all credential operations
4. **Flexibility** - Support multiple device vendors with vendor-specific encryption
5. **Reliability** - Persistent storage and recovery of device credentials

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│   (POS Terminals, Mobile Devices, Administrative Systems)       │
└────────┬──────────────────────────────────────────────────┬─────┘
         │                                                  │
         ▼                                                  ▼
    ┌────────────────────────────────────────────────────────────┐
    │         EstateWS (Spring Boot Application)                 │
    │                                                            │
    │  ┌──────────────────────────────────────────────────────┐ │
    │  │            REST API Controllers                      │ │
    │  │  - TerminalController                               │ │
    │  │  - ClientController                                 │ │
    │  │  - VendorController                                 │ │
    │  │  - DownloadController                               │ │
    │  └──────────────────────────────────────────────────────┘ │
    │                          │                                  │
    │  ┌──────────────────────▼──────────────────────────────┐  │
    │  │         Service Layer                               │  │
    │  │  - TerminalService / Impl                           │  │
    │  │  - ClientKeyService                                 │  │
    │  │  - VendorApiKeyService                              │  │
    │  │  - DownloadService                                  │  │
    │  │  - DeviceKeyTRKService                              │  │
    │  │  - KeyEncryptionService                             │  │
    │  │  - AuditLogService                                  │  │
    │  └──────────────────────▼──────────────────────────────┘  │
    │                          │                                  │
    │  ┌──────────────────────▼──────────────────────────────┐  │
    │  │      Repository Layer (Spring Data JPA)            │  │
    │  │  - TerminalRepository                               │  │
    │  │  - DeviceTRKRepository                              │  │
    │  │  - ClientAPiKeyRepository                           │  │
    │  │  - VendorApiKeyRepository                           │  │
    │  │  - AuditLogRepository                               │  │
    │  └──────────────────────▼──────────────────────────────┘  │
    │                          │                                  │
    │  ┌──────────────────────────────────────────────────────┐ │
    │  │    Cross-Cutting Concerns                           │ │
    │  │  - Global Exception Handler                         │ │
    │  │  - Request Validation                               │ │
    │  │  - Logging & Tracing                                │ │
    │  │  - Async Task Execution                             │ │
    │  └──────────────────────────────────────────────────────┘ │
    └────────┬───────────────────────────┬─────────────────┬────┘
             │                           │                 │
             ▼                           ▼                 ▼
      ┌────────────────────┐    ┌──────────────────┐   ┌─────────────┐
      │  PostgreSQL Aurora │    │   Apigee Service │   │  CommerceHub│
      │  RDS Database      │    │   (API Gateway)  │   │   Scheduler │
      │                    │    │                  │   │             │
      │  deviceapikey      │    │  Key Generation  │   │  Status Sync│
      │  deviceapikeytrk   │    │  & Management    │   └─────────────┘
      │  clientapikey      │    │                  │
      │  vendorapikey      │    │  HMAC Security   │
      │  auditlog          │    │  Signed Requests │
      │                    │    │                  │
      └────────────────────┘    └──────────────────┘
```

### Layered Architecture

**Layer 1: Presentation Layer (REST API)**
- Exposes RESTful endpoints for device, client, and vendor operations
- Handles request validation and marshalling
- Returns standardized JSON responses

**Layer 2: Service Layer**
- Implements business logic for device lifecycle management
- Handles orchestration of complex operations
- Manages transactions and external API calls
- Implements encryption and key generation workflows

**Layer 3: Data Access Layer (Repository Pattern)**
- Uses Spring Data JPA for database operations
- Provides clean abstraction over database
- Supports custom queries via JPQL

**Layer 4: Integration Layer**
- Communicates with Apigee for API key generation
- Integrates with HMAC security for request signing
- Interfaces with CommerceHub scheduler

---

## Core Components

### 1. TerminalController & TerminalService

**Purpose:** Manages the complete lifecycle of POS terminals/devices

#### Endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/v1/terminal/boardNewDevice` | Onboard new POS terminal |
| POST | `/v1/terminal/generateapikey` | Generate API key for device |
| POST | `/v1/terminal/refreshterminalkey` | Rotate/refresh existing key |
| POST | `/v1/terminal/resetterminalkey` | Reset device credentials |
| DELETE | `/v1/terminal/deleteterminalkey` | Deactivate device |
| POST | `/v1/terminal/bulkrefreshterminalkey` | Bulk key refresh operation |

#### Key Operations:

**boardNewDevice()**
```
Input: TerminalApiKeyDto
  - serialNumber: Device unique identifier
  - chMid: CommerceHub Merchant ID
  - chTid: CommerceHub Terminal ID
  - vendorId: Device manufacturer (e.g., "Ingenico")
  - clientId: Device owner/merchant
  - emailId: Contact email
  - userName: Audit trail user

Process:
  1. Validate device uniqueness (by serialNumber, chMid, chTid)
  2. Resolve vendor entity (must exist and be active)
  3. Resolve/create client entity
  4. Store device details in database
  5. Call Apigee to generate API key
  6. Encrypt key using vendor's RSA public key
  7. Store both plain and encrypted keys
  8. Create audit log entry
  9. Track operation in deviceapikeytrk table

Output: EstateResponse with success/failure status
```

**saveTerminalWithApiKeyAndEncryptedKey()**
```
Input: TerminalApiKeyDto

Process:
  1. Call Apigee API with HMAC-signed request
  2. Receive raw API key from Apigee
  3. Fetch vendor's public key
  4. Encrypt API key using RSA + vendor-specific padding
  5. Persist encrypted key to database
  6. Create audit log entry

Output: TerminalApiKey entity with encrypted credentials
```

**refreshTerminalKey()**
```
Input: TerminalApiKeyDto with existing device reference

Process:
  1. Retrieve existing device credentials
  2. Save current key as "previous" in audit trail
  3. Generate new API key from Apigee
  4. Encrypt new key
  5. Update database with new credentials
  6. Set status to PENDING → ENABLED
  7. Clear any CH tracking data
  8. Create migration tracking record

Output: EstateResponse with refresh status
```

### 2. ClientController & ClientKeyService

**Purpose:** Manage client (merchant/application) credentials

#### Endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/v1/client/createclientapikey` | Create client API key |
| POST | `/v1/client/enabledisableclienttoCH` | Enable/disable CH access |

#### Key Entity: ClientApiKeyEntity

```java
clientapikeyid       → PK: Auto-generated ID
clientid             → Unique client identifier
clientemailid        → Contact email
apikey               → API key generated by Apigee
apisecret            → API secret (hidden in JSON)
status               → "A" (Active) or "I" (Inactive)
chEnabled            → "Y" / "N" (CommerceHub enabled flag)
version              → Optimistic locking version
createddate/by       → Audit timestamps
modifieddate/by      → Audit timestamps
```

### 3. VendorController & VendorApiKeyService

**Purpose:** Register and manage device manufacturer (vendor) credentials

#### Endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/v1/vendor/createvenderapikey` | Register vendor credentials |

#### Key Entity: VendorApiKeyEntity

```java
vendorapikeyid       → PK: Auto-generated ID
vendorid             → Vendor name (e.g., "Ingenico", "BBPOS")
vendorpublickey      → RSA public key (PEM or base64)
vendoremailid        → Vendor contact email
apikeysecret         → Vendor's API secret
encryptedkey         → Vendor's encrypted key
status               → "A" (Active) or "I" (Inactive)
environment          → "dev", "qa", "prod"
version              → Optimistic locking version
createddate/by       → Audit timestamps
```

**Important:** Vendor's public key is used to encrypt all API keys for devices manufactured by that vendor.

### 4. DownloadController & DownloadService

**Purpose:** Provide secure API key download mechanism for devices

#### Endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/getTerminalAPIKey` | Query encrypted key by serial number |
| GET | `/getTerminalOrGlobalAPIKey` | Get global key (fallback) |
| GET | `/getTerminalAPIKey?serialNumber=...` | Download device's encrypted key |

#### Download Flow:

```
Device Request with Serial Number
    ↓
Query deviceapikey table by serialNumber
    ↓
Check chEnabled status:
    ├─ "Y" → Return encrypted key + mark as downloaded
    └─ "N" → Mark as "Y" + return encrypted key
    ↓
Create download tracking entry
    ↓
Return: ApiKeyResponse { deviceId, encryptedKey, emailId }
    ↓
Device decrypts using its private key
    ↓
Device uses decrypted API key for CommerceHub authentication
```

### 5. KeyEncryptionService

**Purpose:** Handles RSA-based encryption of API keys

#### Key Features:

- **Algorithm:** RSA/ECB with OAEP Padding
- **Vendor-Specific Padding:** 
  - Ingenico: `RSA/ECB/OAEPPadding`
  - Others: `RSA/ECB/OAEPWithSHA-256AndMGF1Padding`
- **Encoding:** Base64 for transport

#### Encryption Process:

```java
public String encryptKeys(String apiKey, String vendorPublicKey, String vendorId)

1. Validate vendor public key exists
2. Select padding strategy based on vendorId
3. Decode Base64/PEM public key
4. Initialize RSA cipher with public key
5. Encrypt API key bytes
6. Encode result to Base64 string
7. Return encrypted key for storage/transmission

Security: Only the device with corresponding private key can decrypt
```

### 6. ApigeeService

**Purpose:** Integration with Apigee API Gateway for key generation

#### Responsibilities:

- Generate API credentials through Apigee REST API
- Build properly formatted requests with required attributes
- Calculate and sign requests using HMAC-SHA256
- Handle Apigee error responses

#### Configuration:

```properties
apigee.apikey=EH5vXmUMVeUTK08SZRgieLXZ75ZKXFEX
apigee.secret=e95HhWhJedRM6uYpCkDpeT02Lgt3N0GaYwTQXxlDA5D
apigee.url=https://connect-dev.fiservapis.net/ch/v1/organizations/.../apps
```

#### Request Attributes Built:

```java
DISPLAY_NAME          → e.g., "comhub-dev-ClientA-POS2024001-TERMINAL_KEY-key1"
NOTES                 → "Request from FDPOS for Terminal ApiKey"
APIKEY_TYPE          → "TERMINAL_KEY" or "VENDOR_KEY"
ORIGINATOR           → Client ID
X_SERIAL_NUMBER      → Device serial number (for terminal keys)
X_CLIENT_SOURCE_KEY  → Client's API key
X_REGION             → "NA" (North America)
X_ROUTE_TO_TARGETS   → "east2;east1" (Failover routing)
```

### 7. HMACHeaderGenerator

**Purpose:** Generate HMAC-signed headers for Apigee authentication

#### Security Headers Generated:

```
X-Client-Request-ID       → Random unique request ID
X-API-Key                 → Apigee API key
X-Timestamp               → Request timestamp (milliseconds)
Authorization             → HMAC-SHA256 signature
Content-Type              → application/json
X-Auth-Token-Type         → "HMAC"
X-Caller-Source           → "FDPOS"
Accept-Language           → "en"
```

#### Signature Calculation:

```
ToSign = apiKey + clientRequestId + timestamp + bodyJson
Signature = Base64(HMAC-SHA256(ToSign, apiSecret))
```

### 8. AuditLogService

**Purpose:** Comprehensive audit trail for all operations

#### Logged Events:

| Event Type | Triggered By |
|------------|--------------|
| DEVICE_BOARDING | boardNewDevice() |
| DEVICE_KEY_GENERATION | saveTerminalWithApiKeyAndEncryptedKey() |
| DEVICE_KEY_REFRESH | refreshTerminalKey() |
| DEVICE_KEY_RESET | resetTerminalKey() |
| DEVICE_KEY_DELETE | deleteTerminalApiKey() |
| CLIENT_KEY_CREATION | createClientApiKey() |
| DOWNLOAD_SUCCESS | getDeviceApiKey() |
| DOWNLOAD_FAILURE | getDeviceApiKey() error |

#### Audit Log Entry Fields:

```java
auditlogid                → PK
processname              → Event type
chtid                    → Terminal/Device ID
fieldname                → Field being modified
fieldvalue               → New value
requestobject            → Full request payload
createdby                → User who triggered action
responseobject           → Success/failure response
message                  → Status message
status                   → "SUCCESS" / "FAILED"
createddate              → Timestamp
```

---

## Technology Stack

### Core Framework

| Component | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 4.0.1 | Application framework |
| **Java** | 21 | Programming language |
| **Maven** | 3.x | Build & dependency management |

### Data Persistence

| Library | Version | Purpose |
|---------|---------|---------|
| **Spring Data JPA** | 4.0.1 | ORM abstraction |
| **Hibernate** | 6.x | JPA implementation |
| **PostgreSQL Driver** | Latest | Database connector |

### Web & API

| Library | Version | Purpose |
|---------|---------|---------|
| **Spring Web MVC** | 4.0.1 | Web application framework |
| **Spring Validation** | 4.0.1 | Input validation (Jakarta Bean Validation) |
| **Spring Actuator** | 4.0.1 | Health checks & monitoring endpoints |
| **Springdoc OpenAPI** | 3.0.1 | Swagger/OpenAPI documentation |

### Utilities & Tools

| Library | Version | Purpose |
|---------|---------|---------|
| **Lombok** | Latest | Reduce boilerplate (getters, setters, constructors) |
| **Jackson** | 2.13+ | JSON serialization/deserialization |
| **Jackson JSR310** | Latest | Java 8 date/time support |
| **Apache Commons Lang3** | Latest | String utilities and helpers |
| **Apache Commons Codec** | Latest | Encoding/decoding (Base64, HEX) |
| **Google Guava** | 32.0.1 | Collections and utilities |

### Logging & Monitoring

| Library | Version | Purpose |
|---------|---------|---------|
| **SLF4J** | Latest | Logging facade |
| **Logback** | Latest | Logging implementation |
| **Spring Boot Logging** | 4.0.1 | Auto-configured logging |

### Development & Testing

| Library | Version | Purpose |
|---------|---------|---------|
| **Spring Boot DevTools** | 4.0.1 | Live reload during development |
| **Spring Boot Test** | 4.0.1 | Testing framework |

### Database Connection Pool

| Library | Version | Purpose |
|---------|---------|---------|
| **HikariCP** | Auto-configured | Connection pooling |

**Pool Configuration:**
```properties
maximum-pool-size=10
minimum-idle=2
idle-timeout=30000ms
max-lifetime=1800000ms (30 minutes)
connection-timeout=30000ms
```

---

## Data Models

### Entity Relationship Diagram

```
┌─────────────────────────┐
│   clientapikey          │
├─────────────────────────┤
│ PK: clientapikeyid      │
│    clientid             │
│    apikey               │
│    apisecret            │
│    status               │
│    chEnabled            │
│    createddate/by       │
└──────────┬──────────────┘
           │ 1:N
           │
           ├─────────────────────────────────────────────┐
           │                                             │
           ▼                                             ▼
    ┌──────────────────────┐              ┌──────────────────────┐
    │  deviceapikey        │              │  vendorapikey        │
    ├──────────────────────┤              ├──────────────────────┤
    │ PK: deviceapikeyid   │              │ PK: vendorapikeyid   │
    │ FK: clientapikeyid   │              │    vendorid          │
    │ FK: vendorapikeyid   │◄─────────────┤    vendorpublickey   │
    │    clientid          │   1:N        │    apikeysecret      │
    │    vendorid          │              │    encryptedkey      │
    │    serialnumber      │              │    status            │
    │    apikeysecret      │              │    environment       │
    │    encryptedkey      │              │    createddate/by    │
    │    chstatus          │              │    modifieddate/by   │
    │    chEnabled         │              └──────────────────────┘
    │    chlocation        │
    │    createddate/by    │
    │    modifieddate/by   │
    └──────────┬───────────┘
               │ 1:N
               │
               ▼
    ┌────────────────────────────┐
    │  deviceapikeytrk           │
    ├────────────────────────────┤
    │ PK: deviceapikeytrkid      │
    │ FK: deviceapikeyid         │
    │    action (NEW/REFRESH/...)│
    │    prevapikey              │
    │    currapikey              │
    │    prevencryptedkey        │
    │    currencryptedkey        │
    │    createddate/by          │
    │    modifieddate/by         │
    └────────────────────────────┘

Audit Trail:
    ┌────────────────────────────┐
    │  auditlog                  │
    ├────────────────────────────┤
    │ PK: auditlogid             │
    │    processname             ││    chtid                   │
    │    fieldname/fieldvalue    │
    │    requestobject           │
    │    responseobject          │
    │    createdby               │
    │    status                  │
    │    createddate             │
    └────────────────────────────┘

Download Tracking:
    ┌────────────────────────────┐
    │  devicekeydownloadtracker  │
    ├────────────────────────────┤
    │ PK: id                     │
    │ FK: deviceapikeyid         │
    │    downloadtype            │
    │    downloadstatus          │
    │    downloadmessage         │
    │    createddate/by          │
    └────────────────────────────┘
```

### Key Entities

#### 1. TerminalApiKey

Primary entity representing a device's API credentials.

```java
@Entity
@Table(name = "deviceapikey")
public class TerminalApiKey {
    @Id @GeneratedValue
    Integer deviceApiKeyId;              // Unique ID
    
    Integer clientApiKeyId;              // FK to client
    Integer vendorApiKeyId;              // FK to vendor
    
    @ManyToOne(fetch = FetchType.LAZY)
    ClientApiKeyEntity clientApiKey;     // Client relationship
    
    @ManyToOne(fetch = FetchType.LAZY)
    VendorApiKeyEntity vendorApiKey;     // Vendor relationship
    
    String clientId;                     // Client identifier
    String vendorId;                     // Device manufacturer
    String emailId;                      // Contact email
    
    String chmId;                        // CommerceHub Merchant ID
    String chtId;                        // CommerceHub Terminal ID
    String serialNumber;                 // Device serial number
    
    String apiKeySecret;                 // Plain API key (not serialized in JSON)
    String encryptedKey;                 // Encrypted key for transmission
    
    String chStatus;                     // Status: PENDING, ENABLED, DISABLED
    String chEnabled;                    // "Y" / "N"
    String chLocation;                   // CH location identifier
    
    LocalDate createdDate;
    String createdBy;
    LocalDate modifiedDate;
    String modifiedBy;
}
```

#### 2. DeviceApiKeyTrk

Audit trail entity tracking all changes to device keys.

```java
@Entity
@Table(name = "deviceapikeytrk")
public class DeviceApiKeyTrk {
    @Id @GeneratedValue
    Integer deviceApiKeyTrkId;           // Unique tracking ID
    
    Integer deviceApiKeyId;              // References deviceapikey
    
    String chmId;                        // CommerceHub Merchant ID
    String chtId;                        // CommerceHub Terminal ID
    String serialNumber;                 // Device serial number
    
    String action;                       // NEW, REFRESH, RESET, DELETE
    
    String prevApiKey;                   // Previous API key (encrypted)
    String currApiKey;                   // Current API key (encrypted)
    String prevEncryptedKey;             // Previous encrypted key
    String currEncryptedKey;             // Current encrypted key
    
    String prevchEnabled;                // Previous CH enabled status
    
    LocalDate createdDate;
    String createdBy;
    LocalDate modifiedDate;
    String modifiedBy;
}
```

#### 3. ClientApiKeyEntity

Client/Merchant credentials.

```java
@Entity
@Table(name = "clientapikey")
public class ClientApiKeyEntity {
    @Id @GeneratedValue
    Integer clientApiKeyId;              // Unique ID
    
    String clientId;                     // Client identifier
    String emailId;                      // Contact email
    
    String apiKey;                       // Apigee-generated API key
    String apiKeySecret;                 // Apigee-generated secret (hidden)
    
    String status;                       // "A" (Active) / "I" (Inactive)
    String chEnabled;                    // "Y" / "N" (CH enabled)
    
    Integer version;                     // Optimistic locking
    
    LocalDate createdDate;
    String createdBy;
    LocalDate modifiedDate;
    String modifiedBy;
}
```

#### 4. VendorApiKeyEntity

Device vendor/manufacturer credentials with encryption key.

```java
@Entity
@Table(name = "vendorapikey")
public class VendorApiKeyEntity {
    @Id @GeneratedValue
    Integer vendorApiKeyId;              // Unique ID
    
    String vendorId;                     // Vendor name (e.g., "Ingenico")
    String publicKey;                    // RSA public key (base64 or PEM)
    String emailId;                      // Vendor contact
    
    String apiKeySecret;                 // Vendor's API secret
    String encryptedKey;                 // Vendor's encrypted key
    
    String status;                       // "A" / "I"
    String environment;                  // "dev", "qa", "prod"
    
    Integer version;                     // Optimistic locking
    
    LocalDate createdDate;
    String createdBy;
    LocalDate modifiedDate;
    String modifiedBy;
}
```

---

## API Endpoints

### Authentication & Security

All endpoints to Apigee are secured with:
- **HMAC-SHA256 Signature** in Authorization header
- **Timestamp** to prevent replay attacks
- **Client Request ID** for request tracing

### Terminal Management API

#### 1. Board New Device

```http
POST /v1/terminal/boardNewDevice
Content-Type: application/json

{
  "serialNumber": "POS-2024-001",
  "chMid": "123456",
  "chTid": "789",
  "vendorId": "Ingenico",
  "clientId": "MerchantA",
  "emailId": "ops@merchantA.com",
  "userName": "admin"
}

Response 200 OK:
{
  "message": "Device boarded successfully",
  "code": "200",
  "status": "success"
}

Response 400 Bad Request:
{
  "message": "Device already exists...",
  "code": "400",
  "status": ""
}
```

#### 2. Generate API Key

```http
POST /v1/terminal/generateapikey
Content-Type: application/json

{
  "serialNumber": "POS-2024-001",
  "chMid": "123456",
  "chTid": "789",
  "vendorId": "Ingenico",
  "clientId": "MerchantA",
  "userName": "admin"
}

Response 200 OK:
{
  "message": "Key generated successfully",
  "code": "200",
  "status": "success"
}
```

#### 3. Refresh Terminal Key

```http
POST /v1/terminal/refreshterminalkey
Content-Type: application/json

{
  "serialNumber": "POS-2024-001",
  "chMid": "123456",
  "chTid": "789",
  "userName": "admin"
}

Response 200 OK:
{
  "message": "Key refreshed successfully",
  "code": "200",
  "status": "success"
}
```

#### 4. Reset Terminal Key

```http
POST /v1/terminal/resetterminalkey
Content-Type: application/json

{
  "serialNumber": "POS-2024-001",
  "chMid": "123456",
  "chTid": "789",
  "userName": "admin"
}

Response 200 OK:
{
  "message": "Key reset successfully",
  "code": "200",
  "status": "success"
}
```

#### 5. Delete Terminal Key

```http
DELETE /v1/terminal/deleteterminalkey
Content-Type: application/json

{
  "serialNumber": "POS-2024-001",
  "chMid": "123456",
  "chTid": "789",
  "userName": "admin"
}

Response 200 OK:
{
  "message": "Device deleted successfully",
  "code": "200",
  "status": "success"
}
```

#### 6. Bulk Refresh Terminal Keys

```http
POST /v1/terminal/bulkrefreshterminalkey?terminalIds=1,2,3,4,5

Response 200 OK:
[
  {
    "terminalId": 1,
    "oldKeyHash": "abc123...",
    "newKeyHash": "def456...",
    "status": "success",
    "timestamp": "2026-04-06T10:30:00Z"
  },
  {
    "terminalId": 2,
    "oldKeyHash": "ghi789...",
    "newKeyHash": "jkl012...",
    "status": "success",
    "timestamp": "2026-04-06T10:31:00Z"
  }
]
```

### Client Management API

#### Create Client API Key

```http
POST /v1/client/createclientapikey
Content-Type: application/json

{
  "clientId": "MerchantA",
  "emailId": "admin@merchantA.com"
}

Response 200 OK:
{
  "clientId": "MerchantA",
  "apiKey": "generated-api-key-123",
  "status": "A"
}
```

#### Enable/Disable Client to CommerceHub

```http
POST /v1/client/enabledisableclienttoCH
Content-Type: application/json

{
  "clientId": "MerchantA",
  "chEnabled": "Y"
}

Response 200 OK:
{
  "message": "Client CH status updated",
  "code": "200",
  "status": "success"
}
```

### Vendor Management API

#### Create Vendor API Key

```http
POST /v1/vendor/createvenderapikey
Content-Type: application/json

{
  "vendorId": "Ingenico",
  "vendorPublicKey": "MIIBIjANBgkqhkiG9w0BA...",
  "emailId": "tech@ingenico.com"
}

Response 200 OK:
{
  "message": "Vendor API key created",
  "code": "200",
  "status": "success"
}
```

### Download API (Device Key Retrieval)

#### Get Encrypted Terminal API Key

```http
GET /getTerminalAPIKey?serialNumber=POS-2024-001

Response 200 OK:
{
  "deviceApiKeyId": 1001,
  "encryptedApiKey": "BASE64_ENCRYPTED_KEY_STRING",
  "emailId": "ops@merchantA.com"
}
```

#### Get Global/Fallback Key

```http
GET /getTerminalOrGlobalAPIKey?serialNumber=POS-2024-001

Response 200 OK:
{
  "deviceApiKeyId": 1001,
  "encryptedApiKey": "VENDOR_PUBLIC_KEY_OR_GLOBAL_KEY",
  "emailId": "ops@merchantA.com"
}
```

---

## Security & Encryption

### Encryption Architecture

```
┌─────────────────────────┐
│ Plain API Key           │
│ "XYZ789-API-KEY-12345" │
└────────────┬────────────┘
             │
             ▼ RSA Encryption
  ┌──────────────────────────────┐
  │ Vendor Public Key            │
  │ (From vendorapikey table)    │
  │ e.g., Ingenico's public key │
  └──────────────────────────────┘
             │
             ▼ Base64 Encode
  ┌──────────────────────────────┐
  │ Encrypted Key (Base64)       │
  │ "qN8d7kL9...vZ2xM5pQ=="     │
  └──────────────────────────────┘
             │
             ▼ Storage / Transmission
  ┌──────────────────────────────┐
  │ Database / HTTP Response     │
  │ (encryptedkey column)        │
  └──────────────────────────────┘

Reverse Process (on Device):
  Encrypted Key → Decrypt with Device's Private Key → Plain API Key
```

### RSA Configuration

| Vendor | Padding Algorithm | Notes |
|--------|-------------------|-------|
| Ingenico | RSA/ECB/OAEPPadding | Vendor-specific |
| Others | RSA/ECB/OAEPWithSHA-256AndMGF1Padding | Standard OAEP |

### Key Management Principles

1. **Plain API keys** are stored in database (apikeysecret column)
   - Not serialized in JSON responses
   - Used only internally for Apigee communication

2. **Encrypted keys** are transmitted to devices
   - Stored in encryptedkey column
   - Safe to transmit over HTTP/HTTPS
   - Only decryptable by device with matching private key

3. **Vendor public keys** enable one-directional encryption
   - Stored in vendorapikey table
   - Used at encryption time
   - Device has matching private key (installed securely)

4. **Key rotation** maintains security
   - Old keys stored in deviceapikeytrk audit table
   - New keys generated on refresh
   - No key reuse across device lifecycle

### HMAC Security for Apigee

All Apigee API calls are signed with HMAC-SHA256:

```
Signature Components:
  - API Key (from apigee.apikey)
  - Client Request ID (random unique ID)
  - Timestamp (milliseconds since epoch)
  - Request Body (JSON payload)
  - API Secret (from apigee.secret)

Signature = Base64(HMAC-SHA256(apiKey + clientId + timestamp + body, secret))

Apigee validates signature to ensure:
  - Request origin authenticity
  - Request hasn't been tampered with
  - Request isn't replayed (timestamp check)
```

---

## Database Design

### PostgreSQL Aurora Configuration

```properties
# Connection URL
spring.datasource.url=jdbc:postgresql://dev-fem-rds-aurora.fiservestatemgmt-tca-nonprod-dev-nonprod.aws.fisv.cloud:5432/EstateMgmtDBDEV?sslmode=require&currentSchema="EstateMgmt"

# Credentials (Stored securely in AWS Secrets Manager in production)
spring.datasource.username=prospectdb

# SSL/TLS Connection
sslmode=require

# Schema
currentSchema="EstateMgmt"
```

### Connection Pool (HikariCP)

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000ms
spring.datasource.hikari.max-lifetime=1800000ms (30 min)
spring.datasource.hikari.connection-timeout=30000ms
```

### Hibernate Configuration

```properties
# DDL Strategy
spring.jpa.hibernate.ddl-auto=none
# (Production: validate, Development: create-drop)

# Dialect
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Query Logging
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Key Tables

#### deviceapikey

```sql
CREATE TABLE deviceapikey (
    deviceapikeyid SERIAL PRIMARY KEY,
    clientapikeyid INTEGER REFERENCES clientapikey(clientapikeyid),
    vendorapikeyid INTEGER REFERENCES vendorapikey(vendorapikeyid),
    clientid VARCHAR(100),
    vendorid VARCHAR(100) NOT NULL,
    emailid VARCHAR(100),
    chmid VARCHAR(100),
    chtid VARCHAR(100) UNIQUE,
    serialnumber VARCHAR(100),
    apikeysecret VARCHAR(500) NOT NULL,
    encryptedkey VARCHAR(2048) NOT NULL,
    chstatus VARCHAR(50),
    chenabled VARCHAR(1),
    chlocation VARCHAR(100),
    createddate DATE DEFAULT CURRENT_DATE,
    createdby VARCHAR(100),
    modifieddate DATE,
    modifiedby VARCHAR(100)
);
```

#### deviceapikeytrk

```sql
CREATE TABLE deviceapikeytrk (
    deviceapikeytrkid SERIAL PRIMARY KEY,
    deviceapikeyid INTEGER REFERENCES deviceapikey(deviceapikeyid),
    chmid VARCHAR(100),
    chtid VARCHAR(100),
    serialnumber VARCHAR(100),
    action VARCHAR(50) NOT NULL,
    prevapikey VARCHAR(512),
    currapikey VARCHAR(512),
    prevencryptedkey VARCHAR(2048),
    currencryptedkey VARCHAR(2048),
    chenabled VARCHAR(1),
    createddate DATE DEFAULT CURRENT_DATE,
    createdby VARCHAR(100),
    modifieddate DATE,
    modifiedby VARCHAR(100)
);
```

#### Index Strategy

```sql
CREATE INDEX idx_deviceapikey_serial ON deviceapikey(serialnumber);
CREATE INDEX idx_deviceapikey_chtid ON deviceapikey(chtid);
CREATE INDEX idx_deviceapikey_status ON deviceapikey(chstatus);
CREATE INDEX idx_deviceapikeytrk_deviceid ON deviceapikeytrk(deviceapikeyid);
CREATE INDEX idx_clientapikey_clientid ON clientapikey(clientid);
CREATE INDEX idx_vendorapikey_vendorid ON vendorapikey(vendorid);
```

---

## Configuration & Deployment

### Application Properties

```properties
# ================================================================
# SERVER CONFIGURATION
# ================================================================
server.port=9000
server.address=0.0.0.0
server.servlet.context-path=/

# ================================================================
# DATABASE
# ================================================================
spring.datasource.url=jdbc:postgresql://dev-fem-rds-aurora.{region}.aws.fisv.cloud:5432/{dbname}?sslmode=require&currentSchema="EstateMgmt"
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.connection-timeout=30000

# ================================================================
# LOGGING
# ================================================================
spring.profiles.active=dev
logging.file.name=logs/estatews.log
logging.level.root=INFO
logging.level.org.springframework=WARN
logging.level.org.hibernate=ERROR

logging.pattern.console=%d{HH:mm:ss.SSS} [%X{traceId}] %-5level [%thread] [%F][%M:%L] - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss.SSS} [%X{traceId}] %-5level [%thread] [%F][%M:%L] - %msg%n

# Rolling File Policy
logging.logback.rollingpolicy.file-name-pattern=logs/archive/estatews.%d{yyyy-MM-dd}.%i.log.gz
logging.logback.rollingpolicy.max-file-size=50MB
logging.logback.rollingpolicy.max-history=30

# ================================================================
# APIGEE CONFIGURATION
# ================================================================
apigee.apikey=${APIGEE_API_KEY}
apigee.secret=${APIGEE_API_SECRET}
apigee.url=${APIGEE_URL}
```

### Dockerfile

```dockerfile
# Multi-stage build for optimization
ARG JRE_IMG_21
FROM ${JRE_IMG_21}

RUN echo "Using JRE Image: $JRE_IMG_21"

# DevOps metadata
ARG CICD_INFO
ENV GBS_CICD_INFO=$CICD_INFO
RUN echo $GBS_CICD_INFO

# Application setup
LABEL authors="DL-NA-GBSTech-DevOps@fiserv.com"
EXPOSE 9000

USER 0
RUN chmod -R 777 /opt
RUN mkdir -p /opt/docker

USER 1001

# Application JAR added in CI/CD pipeline
# COPY target/estatews-*.jar /opt/docker/estatews.jar
# ENTRYPOINT ["java", "-jar", "/opt/docker/estatews.jar"]
```

### Build & Deployment

**Maven Build:**
```bash
mvn clean package -DskipTests
mvn clean package -Pdev
```

**Docker Build:**
```bash
docker build \
  --build-arg JRE_IMG_21="registry/jre:21" \
  --build-arg CICD_INFO="GitLab:pipeline:$CI_PIPELINE_ID,Branch:$CI_COMMIT_BRANCH" \
  -t estatews:$VERSION .
```

**Kubernetes Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: estatews
spec:
  replicas: 2
  selector:
    matchLabels:
      app: estatews
  template:
    metadata:
      labels:
        app: estatews
    spec:
      containers:
      - name: estatews
        image: estatews:1.0.0
        ports:
        - containerPort: 9000
        env:
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-username
        - name: APIGEE_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: apigee-apikey
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### GitLab CI/CD Pipeline

The `.gitlab-ci.yml` file orchestrates:
1. Code checkout and compilation
2. Unit test execution
3. Docker image creation
4. Push to registry
5. Deployment to target environments

---

## Error Handling

### Global Exception Handler

The `GlobalExceptionHandler` class centrally manages all exceptions:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // Handles validation errors
    @ExceptionHandler({ConstraintViolationException.class, HandlerMethodValidationException.class})
    ResponseEntity<ErrorResponse> handleValidationError(Exception ex)
    
    // Handles illegal arguments
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex)
    
    // Handles application state errors
    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex)
    
    // Handles Apigee API errors
    @ExceptionHandler(ApigeeException.class)
    ResponseEntity<ErrorResponse> handleApigee(ApigeeException ex)
    
    // Handles download service errors
    @ExceptionHandler(EsateBaseException.class)
    ResponseEntity<ErrorResponse> handleDownload(EsateBaseException ex)
    
    // Handles vendor errors
    @ExceptionHandler(VendorException.class)
    ResponseEntity<ErrorResponse> handleVendor(VendorException ex)
    
    // Handles client errors
    @ExceptionHandler(ClientException.class)
    ResponseEntity<ErrorResponse> handleClient(ClientException ex)
    
    // Handles JPA errors
    @ExceptionHandler(JpaSystemException.class)
    ResponseEntity<ErrorResponse> handleJpaError(JpaSystemException ex)
}
```

### Custom Exception Types

| Exception | HTTP Status | Use Case |
|-----------|------------|----------|
| `ApigeeException` | 400/401/500 | Apigee API failures |
| `ClientException` | 400 | Client not found or invalid |
| `TerminalException` | 400 | Device not found or invalid |
| `VendorException` | 400 | Vendor not found or invalid |
| `EsateBaseException` | 404/400 | Generic service errors |
| `IllegalStateException` | 422 | Unprocessable state |
| `IllegalArgumentException` | 400 | Invalid input |

### Error Response Format

```json
{
  "message": "Device already exists with serialNumber: POS-2024-001",
  "code": 400,
  "status": "FAILED"
}
```

---

## Audit & Logging

### Logging Strategy

**Log Levels:**
- **ERROR:** Application failures requiring attention
- **WARN:** Unexpected conditions, validation failures
- **INFO:** Significant events (device boarding, key generation, refresh)
-**DEBUG:** Internal flow tracking (not enabled in production)

### Log Format

```
%d{yyyy-MM-dd HH:mm:ss.SSS} [%X{traceId}] %-5level [%thread] [%F][%M:%L] - %msg%n
```

**Example:**
```
2026-04-06 10:30:45.123 [abc123def456] INFO [pool-1-thread-5] [TerminalServiceImpl.java][boardNewDevice:130] - Device boarding started
2026-04-06 10:30:46.456 [abc123def456] INFO [pool-1-thread-5] [TerminalServiceImpl.java][saveTerminalWithApiKeyAndEncryptedKey:170] - APIKey and Encrypted Key generated successfully
```

### Audit Logging

Every significant operation is logged to the `auditlog` table:

```java
auditLogService.logAuditEvent(
    Constants.DEVICE_BOARDING,           // Process name
    terminalApiKey.getChtId(),           // Device ID
    Constants.SERIAL_NUMBER,             // Field name
    terminalApiKey.getSerialNumber(),   // Field value
    requestMsg,                          // Full request
    terminalApiKeyDto.userName(),        // User who triggered
    Constants.SUCCESS,                   // Status
    "Device boarded successfully",       // Message
    ""                                   // Response
);
```

### Log File Management

```properties
# Rolling file policy
logging.logback.rollingpolicy.file-name-pattern=logs/archive/estatews.%d{yyyy-MM-dd}.%i.log.gz
logging.logback.rollingpolicy.max-file-size=50MB        # Roll at 50MB
logging.logback.rollingpolicy.max-history=30            # Keep 30 days
logging.logback.rollingpolicy.clean-history-on-start=true
```

---

## Integration Points

### 1. Apigee Integration

**Purpose:** Generate API credentials

**Integration Type:** REST API with HMAC-SHA256 signing

**Request Flow:**
```
EstateWS → [HMAC-Sign Request] → Apigee API
     ↓
[Generate API Key & Secret]
     ↓
Apigee → [Return Credentials] → EstateWS
     ↓
[Encrypt with Vendor Public Key]
     ↓
[Store in Database]
```

**Error Handling:**
- 409 Conflict: Duplicate key request
- 400 Bad Request: Invalid parameters
- 401 Unauthorized: Invalid HMAC signature
- 500 Server Error: Apigee internal error

### 2. CommerceHub Integration

**Purpose:** Synchronize device keys and status with payment system

**Status Tracking:**
```
Device Status Lifecycle:
  PENDING → In-flight state after key generation
  ↓
  Check with CommerceHub for acceptance
  ↓
  ENABLED → Device active and accepted by CH
  ↓
  DISABLED → Device deactivated or rejected
```

**Scheduled Synchronization:** `CommerceHubScheduler` runs periodic checks (currently disabled but available for re-enablement):

```java
@Scheduled(fixedDelay = 60_000)  // Run every 60 seconds
public void runEveryMinute() {
    // Find all devices in PENDING status
    // Attempt to send keys to CommerceHub
    // Update status based on response
}
```

### 3. PostgreSQL Aurora RDS

**Purpose:** Persistent data storage

**Connection:** SSL/TLS encrypted
**Schema:** "EstateMgmt"
**Tables:** deviceapikey, deviceapikeytrk, clientapikey, vendorapikey, auditlog, etc.

### 4. AWS Secrets Manager (Production)

**Purpose:** Secure credential storage

**Secrets Managed:**
- Database username & password
- Apigee API key & secret
- Vendor public keys
- TLS certificates

---

## Flow Diagrams

### Device Onboarding Flow

```
┌─────────────────┐
│  Admin/System   │
└────────┬────────┘
         │
         │ POST /v1/terminal/boardNewDevice
         │ {serialNumber, chMid, chTid, vendorId, clientId, ...}
         ▼
    ┌────────────────────────┐
    │ TerminalController     │
    └──────────────┬─────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │ TerminalService.boardNewDevice()         │
    │                                          │
    │ 1. Check device uniqueness               │
    │    - By serialNumber                     │
    │    - By {chMid, chTid, serialNumber}    │
    │    - By chtId                            │
    │                                          │
    │ 2. Validate vendor exists (status="A")   │
    │                                          │
    │ 3. Resolve or create client              │
    │    - If exists: use existing             │
    │    - If not: call ClientKeyService       │
    │      → Generates new client key          │
    │                                          │
    │ 4. Create TerminalApiKey entity          │
    │    - Set relationships to client/vendor  │
    │    - Set device identifiers              │
    │    - Save to database (chStatus=null)    │
    │                                          │
    │ 5. Call                                  │
    │    saveTerminalWithApiKeyAndEncryptedKey │
    │    → Generate key from Apigee            │
    │    → Encrypt with vendor public key      │
    │    → Update database                     │
    │                                          │
    │ 6. Call DeviceKeyTRKService              │
    │    → Create audit trail entry            │
    │    → Action="NEW"                        │
    │    → Record currApiKey (encrypted)       │
    │                                          │
    │ 7. Log audit event                       │
    │    → Status: SUCCESS                     │
    │    → Timestamp, user, request details    │
    │                                          │
    └──────────────────┬───────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────┐
    │ HTTP 200 OK                  │
    │ {                            │
    │   message: "Device boarded"  │
    │   code: "200"                │
    │   status: "success"          │
    │ }                            │
    └──────────────────────────────┘
```

### Key Generation & Encryption Flow

```
┌─────────────────────────────────┐
│ saveTerminalWithApiKeyAndEncryptedKey()
└────────────┬────────────────────┘
             │
             ▼
    ┌────────────────────────────────────┐
    │ fetchApigeeCredential()            │
    │                                    │
    │ Build ApigeeAttributeRequest:      │
    │ - displayName: formatted string     │
    │ - notes: "FDPOS Request"            │
    │ - xApiKey: "TERMINAL_KEY"           │
    │ - serialNumber                      │
    │ - clientSourceApiKey                │
    │ - region: "NA"                      │
    │ - routeTargets: "east2;east1"       │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ ApigeeService.buildApiGeeRequest() │
    │                                    │
    │ Convert attributes to Apigee       │
    │ request format                     │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ HMACHeaderGenerator                │
    │                                    │
    │ Generate Headers:                  │
    │ - X-Client-Request-ID              │
    │ - X-API-Key                        │
    │ - X-Timestamp (milliseconds)       │
    │ - Authorization (HMAC-SHA256)      │
    │ - Additional security headers      │
    │                                    │
    │ Signature = Base64(HMAC-SHA256(    │
    │   apiKey + requestId + timestamp   │
    │   + body                           │
    │   , secret                         │
    │ ))                                 │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ RestClient HTTP POST to Apigee     │
    │ /ch/v1/organizations/.../apps      │
    └────────────┬─────────────────────┘
                 │
            (Network)
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Apigee API Gateway                 │
    │                                    │
    │ 1. Validate HMAC signature         │
    │ 2. Check timestamp (replay attack) │
    │ 3. Generate API key & secret       │
    │ 4. Return credentials              │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ EstateWS (Response Handler)        │
    │                                    │
    │ Parse JSON response:               │
    │ {                                  │
    │   "credentials": {                 │
    │     "key": "ABC123...",            │
    │     "secret": "XYZ789..."          │
    │   }                                │
    │ }                                  │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ KeyEncryptionService.encryptKeys() │
    │                                    │
    │ 1. Fetch vendor from db            │
    │ 2. Get vendor's RSA public key     │
    │ 3. Select padding:                 │
    │    ├─ Ingenico:                    │
    │    │  RSA/ECB/OAEPPadding           │
    │    └─ Others:                      │
    │       RSA/ECB/OAEPWithSHA-256      │
    │       AndMGF1Padding               │
    │ 4. Decode public key (Base64/PEM) │
    │ 5. Initialize RSA cipher           │
    │ 6. Encrypt API key bytes           │
    │ 7. Base64 encode result            │
    │ 8. Return encrypted key            │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Update TerminalApiKey Entity:      │
    │                                    │
    │ - apiKeySecret = plain key         │
    │ - encryptedKey = encrypted key     │
    │ - Save to database                 │
    │ - Update modifiedDate/By           │
    └────────────┬─────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Return: TerminalApiKey             │
    │ (with encrypted key)               │
    └────────────────────────────────────┘
```

### Device Key Download & Usage Flow

```
┌──────────────────┐
│  POS Terminal    │
└────────┬─────────┘
         │
         │ GET /getTerminalAPIKey?serialNumber=POS-2024-001
         │
         ▼
    ┌────────────────────────────────┐
    │ DownloadController             │
    │ getDeviceApiKey(serialNumber)  │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ DownloadService                │
    │                                │
    │ 1. Query deviceapikey table     │
    │    by serialNumber              │
    │                                │
    │ 2. If not found:                │
    │    → Throw EsateBaseException   │
    │    → HTTP 404                   │
    │                                │
    │ 3. Get chEnabled flag:          │
    │    ├─ If "N":                   │
    │    │  - Set to "Y"              │
    │    │  - Update modifiedDate/By  │
    │    │  - Save to DB              │
    │    ├─ If "Y":                   │
    │    │  - No update needed        │
    │    │                            │
    │ 4. Call DownloadTrackerService │
    │    → Create download entry      │
    │    → Log: SUCCESS               │
    │                                │
    │ 5. Return:                      │
    │    {                            │
    │      deviceApiKeyId,            │
    │      encryptedKey,              │
    │      emailId                    │
    │    }                            │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ HTTP 200 OK                    │
    │ {                              │
    │   "deviceApiKeyId": 1001,       │
    │   "encryptedApiKey":            │
    │     "qN8d7kL9...vZ2xM5pQ==",   │
    │   "emailId": "ops@...com"       │
    │ }                              │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ POS Terminal                   │
    │                                │
    │ 1. Receive encrypted key       │
    │ 2. Decode Base64               │
    │ 3. Decrypt using private key   │
    │    (pre-installed on device)   │
    │ 4. Extract plain API key       │
    │                                │
    │ Decrypted: "XYZ789-API-KEY..."│
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │ CommerceHub Payment System     │
    │                                │
    │ Device sends:                  │
    │ POST /v1/transactions          │
    │ Authorization: Bearer           │
    │   XYZ789-API-KEY...             │
    │                                │
    │ CommerceHub validates key:     │
    │ ├─ Recognized & active?        │
    │ ├─ Correct signature?          │
    │ ├─ Not expired?                │
    │                                │
    │ If valid:                       │
    │ → Process transaction          │
    │ → Return 200 OK                │
    │                                │
    │ If invalid:                     │
    │ → Return 401 Unauthorized      │
    └────────────────────────────────┘
```

### Key Refresh Flow

```
┌─────────────────────────────────┐
│ Admin/System                    │
└────────┬────────────────────────┘
         │
         │ POST /v1/terminal/refreshterminalkey
         │ {serialNumber, chMid, chTid, userName}
         │
         ▼
    ┌──────────────────────────┐
    │ TerminalService          │
    │ refreshTerminalKey()     │
    └──────────────┬───────────┘
                   │
                   ▼
    ┌───────────────────────────────────┐
    │ 1. Retrieve existing device       │
    │    by {chMid, chTid, serialNum}  │
    │                                   │
    │ 2. Create backup of old key:      │
    │    prevTerminalKey = clone()      │
    │                                   │
    │ 3. Update device state:           │
    │    - chStatus = "PENDING"         │
    │    - chEnabled = "N"              │
    │                                   │
    │ 4. Generate NEW key from Apigee  │
    │    (same as onboarding)           │
    │    → Encrypt with vendor key      │
    │                                   │
    │ 5. Save new key to database       │
    │                                   │
    │ 6. Call DeviceKeyTRKService       │
    │    → action = "REFRESH"           │
    │    → prevApiKey = old (encrypted) │
    │    → currApiKey = new (encrypted) │
    │    → Record both                  │
    │                                   │
    │ 7. Clear CH tracking:             │
    │    → DELETE from                  │
    │      devicekeytochtrkrepository   │
    │    → Reset for new CH sync        │
    │                                   │
    │ 8. Audit log:                     │
    │    → Event: DEVICE_KEY_REFRESH    │
    │    → Status: SUCCESS              │
    │                                   │
    └───────────────────┬───────────────┘
                        │
                        ▼
    ┌──────────────────────────────┐
    │ HTTP 200 OK                  │
    │ {                            │
    │   message: "Key refreshed"   │
    │   code: "200"                │
    │   status: "success"          │
    │ }                            │
    └──────────────────────────────┘

Timeline:
  Old Key Available: [======OLD======]
                                   │
                          Refresh Operation
                                   │
                                   ▼
  New Key Available:                [======NEW======]
  
  old key stored in: deviceapikeytrk.prevapikey
  new key stored in: deviceapikeytrk.currapikey
```

---

## Deployment Checklist

- [ ] PostgreSQL Aurora RDS provisioned with "EstateMgmt" schema
- [ ] Application properties configured with correct database URL
- [ ] Apigee credentials obtained and configured
- [ ] Vendor public keys imported into database
- [ ] Initial client and vendor records created
- [ ] SSL/TLS certificates configured for HTTPS
- [ ] Logging directory (/logs) created with proper permissions
- [ ] Docker image built and pushed to registry
- [ ] Kubernetes namespace created
- [ ] Secrets created in AWS Secrets Manager
- [ ] Health check endpoints configured
- [ ] Monitoring/alerting configured
- [ ] Load balancer/ingress configured
- [ ] Testing: Device onboarding flow verified
- [ ] Testing: Key generation and encryption verified
- [ ] Testing: Error scenarios handled properly
- [ ] Documentation updated
- [ ] Team trained on operations

---

*Document Version: 1.0*  
*Last Updated: April 6, 2026*  
*Status: Complete Architecture Document*


========

DOC 2
estate_management_ui_design.md

# EstateUI - Architecture & Design Document

**Project Name:** EstateUI (Estate Management User Interface)  
**Version:** 0.0.1-SNAPSHOT  
**Organization:** Fiserv Global Business Services (GBS)  
**Team:** DL-NA-GBSTech-DevOps@fiserv.com  
**Documentation Date:** April 6, 2026  
**Application Type:** Hybrid React + Spring Boot Web Application

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Service Integration](#service-integration)
8. [Core Features & Modules](#core-features--modules)
9. [Data Models & DTOs](#data-models--dtos)
10. [API Endpoints](#api-endpoints)
11. [Build & Deployment](#build--deployment)
12. [Security Roadmap](#security-roadmap)
13. [Error Handling](#error-handling)
14. [Configuration](#configuration)
15. [Flow Diagrams](#flow-diagrams)

---

## Executive Summary

**EstateUI** is a modern **React + Spring Boot hybrid web application** designed to provide a comprehensive administrative interface for managing device credentials, API keys, and device lifecycle operations. It serves as the user-facing control panel for Fiserv's estate management system, enabling:

- **Support Staff Access** (Current Phase) - Internal support team manages terminals, vendors, and clients
- **Secure External Access** (Future Phase) - Vendors and external partners access their own credential management

**Key Role:** EstateUI acts as a **proxy and orchestration layer** between end-users and the backend EstateWS microservice, providing:
- **User-friendly UI** for complex credential management operations
- **API Proxy Service** for EstateWS communication
- **Client-side validation** and intelligent form handling
- **Error handling and user feedback** mechanisms
- **Audit-ready operations** with proper logging

**Current Deployment Model:**
- React frontend compiled into Spring Boot `public` folder
- Single JAR deployment for simplified operations
- BFF (Backend for Frontend) pattern with proxy service

---

## System Overview

### Purpose & Scope

EstateUI is the **administrative control center** for estate management operations. It bridges the gap between:
- **End Users** (Support staff, future: vendors)
- **EstateUI Backend** (Spring Boot with React proxy)
- **EstateWS Backend** (Credential management microservice)
- **External Systems** (Apigee, CommerceHub, PostgreSQL)

### Key Responsibilities

1. **Terminal/Device Management UI**
   - Onboard new devices with form validation
   - View, refresh, reset, and manage device keys
   - Bulk operations for multiple devices
   - Client-device migration workflows

2. **Master Key Management UI**
   - Register and manage vendor credentials
   - Maintain client API keys
   - View and update encryption configurations

3. **Bulk Operations UI**
   - Upload device configuration files
   - Enable/disable devices in bulk
   - CommerceHub synchronization management
   - Serial number mapping

4. **API Proxy Layer**
   - Forward requests to EstateWS
   - Abstract backend URL complexity
   - Centralize credential handling

### Current & Future Users

| Phase | Users | Access Level | Security |
|-------|-------|--------------|----------|
| **Current** | Internal Support Staff | Full CRUD on all operations | LDAP/OAuth (Planned) |
| **Future** | Vendors | Limited (own devices only) | OAuth2 + Fine-grained RBAC |
| **Future** | External Partners | Read-only + specific operations | OAuth2 + API key verification |

---

## Architecture Overview

### High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                         USER BROWSER/CLIENT                         │
│                      (Support staff laptop)                          │
│                                                                      │
└───────────────────────────────────────┬──────────────────────────────┘
                                        │
                          HTTP/HTTPS (React Bundle)
                                        │
                          ┌─────────────▼──────────────┐
                          │                            │
        ┌─────────────────┤   EstateUI Application    ├──────────┐
        │                 │                            │          │
        │                 │   Spring Boot + React      │          │
        │                 │   (Port 9000)              │          │
        │                 │                            │          │
        │                 └─────────────┬──────────────┘          │
        │                               │                         │
        │                               │                         │
        ▼                               ▼                         ▼
   ┌──────────────┐          ┌──────────────────────┐    ┌─────────────┐
   │   React      │          │  Spring Boot Backend │    │PostgreSQL   │
   │ Components   │          │  (API Proxy Service) │    │Aurora RDS   │
   │              │          │                      │    │             │
   │ - Forms      │          │  Controllers:        │    │ Tables:     │
   │ - State Mgmt │          │  - AuthController    │    │ - Vendor    │
   │ - Routing    │          │  - EstateWsProxy     │    │ - Client    │
   │ - API Calls  │          │    Controller        │    │ - Device    │
   │              │          │                      │    │             │
   │ Vite Build   │          │ Services:            │    └─────────────┘
   │ TypeScript   │          │  - ApiProxyService   │
   │ Material-UI  │          │  - VendorKeyService  │
   │              │          │                      │
   └──────────────┘          └──────────────┬───────┘
                                            │
                          (REST API Calls)  │
                                            │
                    ┌───────────────────────▼─────────────────┐
                    │                                         │
                    │   EstateWS Backend Service              │
                    │   (API Key Management)                  │
                    │   (Port 9000 - external)                │
                    │                                         │
                    │ - Terminal Management APIs              │
                    │ - Client Management APIs                │
                    │ - Vendor Management APIs                │
                    │ - Download APIs                         │
                    │                                         │
                    └─────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐  ┌─────────────┐  ┌──────────────┐
            │   Apigee     │  │CommerceHub  │  │ PostgreSQL   │
            │ API Gateway  │  │ (CH)        │  │ RDS          │
            │              │  │ Payment     │  │              │
            │ Key Mgmt     │  │ System      │  │Device/Client │
            │              │  │             │  │ Credentials  │
            └──────────────┘  └─────────────┘  └──────────────┘
```

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│   Presentation Layer (React + TypeScript + Material-UI)    │
│   - Forms, Charts, Tables                                  │
│   - State Management (Context API + React Hooks)           │
│   - Authentication UI                                      │
│   - Loading, Error, Success Feedback                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP(S)
┌──────────────────────────▼──────────────────────────────────┐
│   Backend for Frontend (BFF) Layer                          │
│                                                            │
│   Spring Boot REST Controllers                            │
│   - EstateWsProxyController                               │
│   - AuthController (Future)                               │
│                                                            │
│   REST API Proxy Pattern                                  │
│   - Abstracts backend URLs                                │
│   - Translates requests                                   │
│   - Handles authentication                                │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP(S)
┌──────────────────────────▼──────────────────────────────────┐
│   Service Integration Layer                                │
│                                                            │
│   ApiProxyService                                         │
│   - Communicates with EstateWS                            │
│   - Marshals requests/responses                           │
│   - Handles errors                                        │
│                                                            │
│   Local Services                                          │
│   - VendorKeyService (in-memory)                          │
│   - Configuration service                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP(S)
┌──────────────────────────▼──────────────────────────────────┐
│   External Services                                         │
│   - EstateWS Backend                                       │
│   - PostgreSQL Database (via EstateWS)                     │
│   - Apigee API Gateway (via EstateWS)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.0.0 | UI framework & component library |
| **TypeScript** | ~5.7.2 | Type-safe JavaScript development |
| **Material-UI (MUI)** | 7.3.7 | Pre-built component library |
| **MUI Icons** | 7.3.9 | Icon library |
| **React Router** | 7.3.0 | Client-side routing & navigation |
| **Emotion** | 11.14.0 | CSS-in-JS styling solution |
| **SASS** | 1.97.3 | CSS preprocessing |
| **Vite** | 6.2.0 | Build tool & development server |
| **Loglevel** | 1.9.2 | Client-side logging |

**Build & Development:**
```json
{
  "scripts": {
    "dev": "vite",                              // Dev server
    "start": "vite",                            // Alternative start
    "start:dev": "env-cmd -f environments/.env.dev npm run start",
    "build": "tsc -b && vite build",            // Production build
    "lint": "eslint .",                         // Code linting
    "preview": "vite preview"                   // Preview built app
  }
}
```

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 4.0.1 | Java web framework |
| **Java** | 21 | Programming language |
| **Spring Web MVC** | 4.0.1 | REST framework |
| **Spring Data JPA** | 4.0.1 | Database layer (future) |
| **Hibernate** | 6.x | ORM (future) |
| **PostgreSQL Driver** | Latest | Database connectivity |
| **Jackson** | 2.13+ | JSON serialization |
| **Lombok** | Latest | Reduce boilerplate |
| **Apache POI** | 5.2.3 | Excel file processing |
| **Apache Commons Lang3** | Latest | Utilities |
| **SLF4J/Logback** | Latest | Logging framework |
| **Springdoc OpenAPI** | 3.0.1 | Swagger/OpenAPI docs |

### Build Tools

| Tool | Purpose |
|------|---------|
| **Maven** | Backend build orchestration |
| **npm** | Frontend package management |
| **Maven plugins** | Spring Boot packaging, compiler setup |

---

## Frontend Architecture

### Project Structure

```
frontend/
├── src/
│   ├── main.tsx                    # React entry point
│   ├── vite-env.d.ts               # Vite TypeScript types
│   ├── index.scss                  # Global styles
│   ├── App.tsx                     # Root component
│   ├── App.scss                    # Root styles
│   │
│   ├── components/                 # Reusable React components
│   │   ├── user-login/             # Authentication UI
│   │   ├── menu-bar/               # Navigation menus
│   │   │   ├── master-key-management/
│   │   │   │   ├── vendor-key/    # Vendor key admin forms
│   │   │   │   └── client-key/    # Client key admin forms
│   │   │   ├── device-key-management/
│   │   │   │   ├── add-device/     # Device onboarding form
│   │   │   │   ├── view-device/    # Device listing/view
│   │   │   │   ├── generate-refresh-device/  # Key operations
│   │   │   │   ├── reset-device/   # Device reset form
│   │   │   │   ├── enable-disable-device/    # Device status
│   │   │   │   └── client-device-migration/  # Migration UI
│   │   │   └── bulk-api-key/       # Bulk operations
│   │   │       ├── mid-tid-serial-mapping/
│   │   │       ├── ch-key-enable-disable/
│   │   │       └── client-devices-migration/
│   │   ├── common/
│   │   │   └── Generic shared components
│   │   ├── page-loader/            # Loading indicator
│   │   ├── page-snackbar/          # Toast notifications
│   │   ├── tabs/                   # Tab component
│   │   └── menu-bar/               # Main navigation bar
│   │
│   ├── layouts/                    # Page layouts
│   │   ├── main-layout/
│   │   │   └── Layout.tsx          # Main application layout
│   │   ├── header/                 # Header component
│   │   └── footer/                 # Footer component
│   │
│   ├── routes/
│   │   ├── router.tsx              # React Router configuration
│   │   └── route definitions
│   │
│   ├── navigation/
│   │   ├── navigation.config.tsx   # Menu structure & routes
│   │   ├── navigation.types.ts     # TypeScript interfaces
│   │   ├── SideBar.tsx             # Sidebar component
│   │   └── SideBar.scss
│   │
│   ├── store/
│   │   └── context.tsx             # Redux/Context state management
│   │
│   ├── service/
│   │   └── logger.ts               # Client-side logging utility
│   │
│   ├── styles/
│   │   └── Global SCSS styles
│   │
│   ├── utils/
│   │   ├── defaultRoute.ts         # Route constants
│   │   └── helper utilities
│   │
│   └── assets/
│       └── images/
│           └── icons/              # Application icons
│
├── public/
│   └── Static assets (deployed to Spring Boot)
│
├── package.json                   # npm dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.js               # ESLint rules
├── index.html                     # HTML template
└── environments/
    └── .env.dev                   # Development environment variables
```

### Key React Components

#### 1. App.tsx (Root Component)

```typescript
function App() {
  return (
    <AppProvider>                    {/* Global state provider */}
      <RouterProvider router={router} />  {/* React Router */}
    </AppProvider>
  );
}
```

**Features:**
- Context API for state management
- React Router for navigation
- Single-page application (SPA) routing

#### 2. Layout Structure

```
Layout
├── Header
│   └── User info, logout button
├── Sidebar (Navigation)
│   ├── Master Key Management
│   ├── Device Key Management
│   ├── Bulk API Key Operations
│   └── Future: Settings, Reports
├── Main Content Area
│   └── Page components (routed)
└── Footer
    └── Copyright, links
```

#### 3. Navigation Configuration

```typescript
EstateNavBarConfig[]
├── Master Key Management
│   ├── Vendor Key
│   │   ├── Add Vendor
│   │   └── View Vendor
│   └── Client Key
│       ├── Add Client
│       └── View Client
├── Device Key Management
│   ├── Add Device
│   ├── View Device
│   ├── Generate/Refresh Key
│   ├── Reset Key
│   ├── Enable/Disable Key
│   └── Client-Device Migration
└── Bulk API Key Operations
    ├── MID/TID/Serial Mapping
    ├── CH Enable/Disable
    │   ├── By File Upload
    │   ├── By Client
    │   └── By Device
    └── Client Devices Migration
```

### State Management

**Current:** React Context API with Hooks
```typescript
const AppProvider = ({ children }) => {
  // Future: Redux or equivalent
  // Current: Context-based state
};
```

**Future Enhancements:**
- Redux for complex state
- Zustand for lighter alternative
- React Query for server state

### Form Handling

**Technologies:**
- React Hook Form (future implementation)
- Controlled components for now
- Client-side validation
- Field-level error display

**Common Forms:**
- Add Device form (serialNumber, chMid, chTid, vendorId, clientId)
- Add Vendor/Client forms
- Bulk upload forms (Excel)
- Filter/search forms

---

## Backend Architecture

### Spring Boot Structure

```
src/main/java/com/fiserv/estate/
├── Application.java                # Spring Boot entry point
│
├── controller/
│   ├── AuthController.java         # Auth endpoints (placeholders)
│   └── EstateWsProxyController.java # API proxy controller
│
├── service/
│   ├── ApiProxyService.java        # EstateWS proxy logic
│   └── VendorKeyService.java       # Local vendor key service
│
├── dto/
│   └── GenericResponse.java        # Unified response wrapper
│
├── exception/
│   └── Exception handlers
│
├── filter/
│   └── HTTP filters (auth, logging)
│
├── configuration/
│   └── Spring configuration
│
├── common/
│   └── Shared utilities
│
└── utility/
    └── Constants, helpers
```

### Key Controllers

#### 1. EstateWsProxyController

**Purpose:** Act as reverse proxy to EstateWS

```java
@RestController
@RequestMapping("/api/estate-ws-proxy")
public class EstateWsProxyController {
    
    @GetMapping("/**")
    public ResponseEntity<String> proxyGet(HttpServletRequest request);
    
    @PostMapping("/**")
    public ResponseEntity<String> proxyPost(HttpServletRequest request, @RequestBody Object body);
}
```

**Flow:**
```
Frontend Request at /api/estate-ws-proxy/v1/terminal/boardNewDevice
                ↓
EstateWsProxyController
                ↓
Extract path: /v1/terminal/boardNewDevice
                ↓
Call ApiProxyService.getPostResponse("/api/v1/terminal/boardNewDevice", body)
                ↓
RestClient POSTs to EstateWS backend
                ↓
Return response to frontend
```

#### 2. VendorKeyService

**Purpose:** In-memory storage of vendor encryption keys (future: database)

```java
@Service
public class VendorKeyService {
    public List<VendorKey> getAllVendorKeys();
    public VendorKey findByKeyName(String keyName);
    public VendorKey upsertVendorKey(VendorKey vendorKey);
    public boolean deleteVendorKey(String keyName);
}
```

### Key Services

#### 1. ApiProxyService

**Purpose:** Centralized EstateWS integration

```java
@Service
public class ApiProxyService {
    @Value("${estatews.base.url}")
    private String estateBaseUrl;           // e.g., http://estatews:9000
    
    private RestClient restClient;
    
    @PostConstruct
    public void initRestClient() {
        // Initialize Spring 6 RestClient
    }
    
    public GenericResponse<String> getPostResponse(String uri, Object request);
    public GenericResponse<String> getGetResponse(String uri);
    
    private GenericResponse<String> exchange(
        HttpRequest request, 
        RestClient.RequestHeadersSpec.ConvertibleClientHttpResponse response
    );
}
```

**Request Flow:**
```
Input:
- uri: "/api/v1/terminal/boardNewDevice"
- request: { serialNumber: "POS-001", ... }

Process:
1. Build full URL: estatews.base.url + uri
2. POST request with JSON body
3. Handle response (200 OK or error)
4. Wrap in GenericResponse<String>

Output:
GenericResponse {
    statusCode: 200,
    data: "{...response JSON...}",
    status: "OK"
}
```

### Response Wrapper

```java
public class GenericResponse<T> {
    private int statusCode;           // HTTP status
    private T data;                   // Response body
    private String status;            // "OK", "ERROR"
    
    public static <T> GenericResponse<T> success(T data);
    public static <T> GenericResponse<T> error(int code, T data);
}
```

---

## Service Integration

### EstateUI ↔ EstateWS Communication

```
┌─────────────────────────────────────────────────────────┐
│                 EstateUI Application                    │
│                                                         │
│  React Component                                        │
│       │                                                 │
│       │ fetch/axios to /api/estate-ws-proxy/**         │
│       │                                                 │
│       ▼                                                 │
│  EstateWsProxyController (Spring REST)                 │
│       │                                                 │
│       │ Translate path & forward                        │
│       │                                                 │
│       ▼                                                 │
│  ApiProxyService                                        │
│       │                                                 │
│       │ RestClient.post() to EstateWS                   │
│       │ estatews.base.url + /api/v1/***                 │
│       │                                                 │
│       ├─ Add correlation ID                            │
│       ├─ Add tracing headers                           │
│       └─ Handle errors gracefully                      │
│       │                                                 │
│       ▼                                                 │
└─────────────────────────────────────────────────────────┘
                       │
                 HTTP(S) POST/GET
                       │
┌─────────────────────────────────────────────────────────┐
│               EstateWS Backend Service                  │
│               (Port 9000 - externally)                  │
│                                                         │
│  REST Controllers                                       │
│  - TerminalController                                   │
│  - ClientController                                     │
│  - VendorController                                     │
│  - DownloadController                                   │
│       │                                                 │
│       ▼                                                 │
│  Service Layer                                          │
│       │                                                 │
│       ▼                                                 │
│  Repository Layer                                       │
│       │                                                 │
│       ▼                                                 │
│  PostgreSQL Database                                    │
└─────────────────────────────────────────────────────────┘
```

### Configuration

**application.properties:**
```properties
# EstateWS Backend URL (used by ApiProxyService)
estatews.base.url=http://estatews:9000

# OR for development:
# estatews.base.url=http://localhost:9000
```

---

## Core Features & Modules

### 1. Master Key Management Module

**Purpose:** Register and manage system-level credentials

#### 1.1 Vendor Key Management

**UI Forms:**
- **Add Vendor Key Form**
  - Vendor ID (dropdown/searchable)
  - Vendor Public Key (textarea, multi-line)
  - Vendor Email
  - Environment (dev, qa, prod)
  - Status (Active/Inactive)
  - Action buttons: Submit, Clear

- **View Vendor Key List**
  - Table with columns: VendorID, Email, Status, Environment, Actions
  - Actions: Edit, Delete, View Details
  - Filters: Search by vendor ID, filter by status
  - Pagination support

**Backend API Calls:**
```
POST   /api/estate-ws-proxy/v1/vendor/createvenderapikey
GET    /api/estate-ws-proxy/v1/vendor/list (if available)
```

#### 1.2 Client Key Management

**UI Forms:**
- **Add Client Key Form**
  - Client ID
  - Contact Email
  - CH Enabled (Y/N toggle)
  - CH Status
  - Action buttons

- **View Client Key List**
  - Table: ClientID, Email, Status, Actions
  - Filters, pagination
  - Inline status update

**Backend API Calls:**
```
POST   /api/estate-ws-proxy/v1/client/createclientapikey
POST   /api/estate-ws-proxy/v1/client/enabledisableclienttoCH
```

### 2. Device Key Management Module

**Purpose:** Manage terminal/device lifecycle and credentials

#### 2.1 Add Device

**Form Fields:**
- Serial Number (required)
- CommerceHub Merchant ID (required)
- CommerceHub Terminal ID (required)
- Vendor (dropdown, required)
- Client (dropdown, required)
- Email Address
- Form validations (uniqueness, format checks)

**Actions:**
- **Board New Device** → `/api/estate-ws-proxy/v1/terminal/boardNewDevice`
- Generates API key from Apigee
- Encrypts with vendor public key
- Creates audit trail

**Success Response:**
```json
{
  "message": "Device boarded successfully",
  "code": "200",
  "status": "success"
}
```

#### 2.2 View Devices

**Features:**
- List all devices in paginated table
- Columns: SerialNumber, ChMid, ChTid, VendorID, ClientID, Status
- Filters: By vendor, client, status, date range
- Search: By serial number, merchant ID, terminal ID

#### 2.3 Generate/Refresh Key

**Purpose:** Create new API key or rotate existing key

**Form:**
- Select device (by serial number)
- Optional: Specify new merchant ID/terminal ID
- Confirmation dialog

**API Call:**
```
POST /api/estate-ws-proxy/v1/terminal/refreshterminalkey
{
  "serialNumber": "POS-2024-001",
  "chMid": "123456",
  "chTid": "789",
  "userName": "admin"
}
```

**UI Feedback:**
- Show previous key (masked)
- Show new key generation status
- Countdown timer
- Success/failure message

#### 2.4 Reset Key

**Purpose:** Force reset device credentials (emergency)

**Form:**
- Device selection
- Confirmation warning
- Reset reason (dropdown)

**API Call:**
```
POST /api/estate-ws-proxy/v1/terminal/resetterminalkey
```

#### 2.5 Enable/Disable Key

**Purpose:** Toggle device's access to CommerceHub

**Form:**
- Device selection
- Enable/Disable toggle
- Confirmation message

**API Call:**
```
POST /api/estate-ws-proxy/v1/terminal/enabledisableclienttoCH
```

#### 2.6 Delete Key

**Purpose:** Permanently remove device credentials

**Confirmation:**
- Device details display
- "Are you sure?" dialog
- Reason for deletion (optional)

**API Call:**
```
DELETE /api/estate-ws-proxy/v1/terminal/deleteterminalkey
```

#### 2.7 Client-Device Migration

**Purpose:** Move devices from one client to another

**Form:**
- Source Client (dropdown)
- Devices to migrate (multi-select from source client's devices)
- Destination Client (dropdown)
- Migration date/time
- Notification option

---

### 3. Bulk Operations Module

**Purpose:** Perform operations on multiple devices efficiently

#### 3.1 MID/TID/Serial Mapping

**Features:**
- Upload CSV/Excel file with mapping data
- Preview uploaded data
- Validate all rows
- Perform bulk mapping operation
- Download report of results

**File Format:**
```
serialNumber,chMid,chTid,vendorId,clientId,emailId
POS-001,123456,789,Ingenico,ClientA,ops@clienta.com
POS-002,123457,790,BBPOS,ClientB,ops@clientb.com
```

#### 3.2 Enable/Disable in Bulk

**Sub-features:**

**3.2.1 By Client Level**
- Select client
- Apply enable/disable to all client's devices
- Preview affected devices
- Confirmation

**3.2.2 By File Upload**
- Upload CSV with serial numbers
- Select enable/disable action
- Batch process

**3.2.3 By Device List**
- Multi-select devices from table
- Apply action to selection
- Batch process with progress bar

#### 3.3 Client Devices Migration

**Purpose:** Bulk migrate devices across clients

**Features:**
- Source/Destination client selection
- Date-based or immediate migration
- Validation before migration
- Result report with statistics

---

## Data Models & DTOs

### Frontend Data Types (TypeScript)

```typescript
// Device related
interface Device {
  deviceApiKeyId: number;
  serialNumber: string;
  chMid: string;
  chTid: string;
  vendorId: string;
  clientId: string;
  emailId: string;
  chStatus: string;      // PENDING, ENABLED, DISABLED
  chEnabled: string;     // Y / N
  createdDate: string;
  createdBy: string;
}

interface VendorKey {
  name: string;          // Vendor ID
  value: string;         // Public key
  environment?: string;
  status?: string;
}

interface ClientKey {
  clientId: string;
  emailId: string;
  apiKey: string;
  status: string;        // A = Active, I = Inactive
  chEnabled: string;
}

// API Response wrapper
interface GenericResponse<T> {
  statusCode: number;
  data: T;
  status: string;
}

// Form submissions
interface AddDeviceRequest {
  serialNumber: string;
  chMid: string;
  chTid: string;
  vendorId: string;
  clientId: string;
  emailId: string;
}

interface RefreshKeyRequest {
  serialNumber: string;
  chMid: string;
  chTid: string;
  userName: string;
}
```

### Backend DTOs (Java)

```java
@Data
@Builder
public class GenericResponse<T> {
    private int statusCode;
    private T data;
    private String status;
}

@Data
@Builder
public class AddDeviceRequest {
    private String serialNumber;
    private String chMid;
    private String chTid;
    private String vendorId;
    private String clientId;
    private String emailId;
    private String userName;
}

@Data
@Builder
public class VendorKey {
    private String name;
    private String value;
    private String environment;
    private String status;
}
```

---

## API Endpoints

### Proxy API Structure

**Base Path:** `/api/estate-ws-proxy`

All EstateWS APIs are accessible via proxy paths:

```
Frontend Request:      /api/estate-ws-proxy/v1/terminal/boardNewDevice
                            ↓
Proxy Controller:      EstateWsProxyController
                            ↓
Path Translation:      /api/v1/terminal/boardNewDevice
                            ↓
Target:                EstateWS @ http://estatews:9000/api/v1/terminal/boardNewDevice
```

### Master Key Management APIs

```
POST   /api/estate-ws-proxy/v1/vendor/createvenderapikey
       Create new vendor with encryption key

GET    /api/estate-ws-proxy/v1/vendor/list
       List all vendors (if endpoint exists in EstateWS)

POST   /api/estate-ws-proxy/v1/client/createclientapikey
       Create new client

POST   /api/estate-ws-proxy/v1/client/enabledisableclienttoCH
       Update client CH status
```

### Device Management APIs

```
POST   /api/estate-ws-proxy/v1/terminal/boardNewDevice
       {
         "serialNumber": "POS-001",
         "chMid": "123456",
         "chTid": "789",
         "vendorId": "Ingenico",
         "clientId": "ClientA",
         "emailId": "ops@client.com",
         "userName": "admin"
       }
       → Response: EstateResponse { message, code, status }

POST   /api/estate-ws-proxy/v1/terminal/generateapikey
       Generate API key for device

POST   /api/estate-ws-proxy/v1/terminal/refreshterminalkey
       Refresh/rotate device API key

POST   /api/estate-ws-proxy/v1/terminal/resetterminalkey
       Reset device credentials

DELETE /api/estate-ws-proxy/v1/terminal/deleteterminalkey
       Delete device and credentials

POST   /api/estate-ws-proxy/v1/terminal/bulkrefreshterminalkey
       ?terminalIds=1,2,3
       Bulk refresh operation

GET    /api/estate-ws-proxy/getTerminalAPIKey
       ?serialNumber=POS-001
       Download encrypted API key for device
```

---

## Build & Deployment

### Frontend Build Process

**Step 1: Install Dependencies**
```bash
cd frontend
npm install
```

**Step 2: Build React Application**
```bash
npm run build
```

**Output:** `dist/` folder with optimized React bundle

**Step 3: Copy to Spring Boot Public Folder**
```bash
cp -r frontend/dist/* src/main/resources/public/
```

**Automated in Maven Build:**
```xml
<plugin>
  <groupId>com.github.eirslett</groupId>
  <artifactId>frontend-maven-plugin</artifactId>
  <version>1.12.0</version>
  <executions>
    <!-- Install npm -->
    <execution>
      <id>install node and npm</id>
      <phase>generate-resources</phase>
      <goals><goal>install-node-and-npm</goal></goals>
      <configuration>
        <nodeVersion>v18.16.0</nodeVersion>
      </configuration>
    </execution>
    
    <!-- npm install -->
    <execution>
      <id>npm install</id>
      <phase>generate-resources</phase>
      <goals><goal>npm</goal></goals>
    </execution>
    
    <!-- npm build -->
    <execution>
      <id>npm run build</id>
      <phase>generate-resources</phase>
      <goals><goal>npm</goal></goals>
      <configuration>
        <arguments>run build</arguments>
      </configuration>
    </execution>
  </executions>
</plugin>
```

### Backend Build Process

**Maven Build:**
```bash
mvn clean package -DskipTests
```

**Output:** `target/estateui-0.0.1-SNAPSHOT.jar`

**JAR Contains:**
- Spring Boot application code (compiled Java)
- Embedded Tomcat server
- React bundle in `public/` folder
- Application resources (properties, YAML)

### Docker Build & Deployment

**Dockerfile:**
```dockerfile
ARG JRE_IMG_21
FROM ${JRE_IMG_21}

# DevOps metadata
ARG CICD_INFO
ENV GBS_CICD_INFO=$CICD_INFO

LABEL authors="DL-NA-GBSTech-DevOps@fiserv.com"
EXPOSE 9000

USER 0
RUN chmod -R 777 /opt
RUN mkdir -p /opt/docker

USER 1001

ADD ./target/estateui-0.0.1-SNAPSHOT.jar /opt/docker

ENTRYPOINT [
  "java",
  "-Dspring.profiles.active=${APP_ENV}",
  "-cp", "/opt/docker/*:/opt/docker/classes:/opt/docker/lib/*:/opt/docker/resources/*",
  "-jar", "/opt/docker/estateui-0.0.1-SNAPSHOT.jar",
  "--server.port=9000"
]
```

**Docker Build Command:**
```bash
docker build \
  --build-arg JRE_IMG_21="registry/jre:21" \
  --build-arg CICD_INFO="GitLab:pipeline:$CI_PIPELINE_ID" \
  -t estateui:1.0.0 .
```

**Docker Run Command:**
```bash
docker run \
  -p 9000:9000 \
  -e APP_ENV=dev \
  -e ESTATEWS_BASE_URL=http://estatews:9000 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/EstateMgmt \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=pass \
  estateui:1.0.0
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: estateui
  labels:
    app: estateui
spec:
  replicas: 2
  selector:
    matchLabels:
      app: estateui
  template:
    metadata:
      labels:
        app: estateui
    spec:
      containers:
      - name: estateui
        image: estateui:1.0.0
        ports:
        - containerPort: 9000
          name: http
        
        env:
        - name: APP_ENV
          value: "dev"
        
        - name: ESTATEWS_BASE_URL
          value: http://estatews:9000
        
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: db-url
        
        livenessProbe:
          httpGet:
            path: /
            port: 9000
          initialDelaySeconds: 30
          periodSeconds: 10
        
        readinessProbe:
          httpGet:
            path: /
            port: 9000
          initialDelaySeconds: 10
          periodSeconds: 5
        
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: estateui
spec:
  selector:
    app: estateui
  type: LoadBalancer
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9000
```

---

## Security Roadmap

### Current State (Phase 1)

**Current Security Posture:**
- AuthController is currently commented out
- No authentication enforced
- Internal-only access (assumes network security)
- Basic Spring Security setup available

### Phase 2: Basic Authentication

**Objectives:**
- LDAP integration for support staff
- Session-based authentication
- CSRF protection
- HTTPS enforcement

**Implementation:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .authorizeRequests()
            .requestMatchers("/api/**").authenticated()
            .requestMatchers("/").permitAll()
            .and()
            .formLogin()
            .and()
            .logout();
        return http.build();
    }
}
```

### Phase 3: OAuth2/OpenID Connect

**Objectives:**
- OAuth2 for external user access
- OpenID Connect for identity federation
- Role-based access control (RBAC)
- Fine-grained permissions

**AuthController Implementation:**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @GetMapping("/userinfo")
    public ResponseEntity<Map<String, Object>> getUserInfo(
        @AuthenticationPrincipal OidcUser oidcUser
    ) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("sub", oidcUser.getSubject());
        userInfo.put("name", oidcUser.getFullName());
        userInfo.put("email", oidcUser.getEmail());
        userInfo.put("groups", oidcUser.getClaimAsStringList("groups"));
        return ResponseEntity.ok(userInfo);
    }
}
```

### Phase 4: Advanced Security

**Objectives:**
- API key-based authentication for vendors
- Device-based authentication
- Rate limiting
- API gateway integration
- Audit logging enhancement

---

## Error Handling

### Client-Side Error Handling

**Types of Errors:**
1. **Network Errors** - Connection failures, timeouts
2. **Validation Errors** - Form validation failures
3. **Server Errors** - 4xx/5xx responses from backend
4. **Business Logic Errors** - Device already exists, duplicate key, etc.

**User Feedback (UI Components):**
```typescript
// Error display strategies:
1. Form field-level errors (inline)
2. Toast notifications (Snackbar)
3. Modal dialogs for critical errors
4. Error boundaries for component crashes
5. Retry mechanisms for failed requests
```

### Backend Error Responses

**Standard Error Response Format:**
```json
{
  "statusCode": 400,
  "data": "Device already exists with serialNumber: POS-001",
  "status": "ERROR"
}
```

### Common Error Scenarios

| Scenario | HTTP Status | Message |
|----------|------------|---------|
| Device already exists | 400 | "Device already exists with serialNumber..." |
| Vendor not found | 400 | "Vendor does not exist with vendor Id..." |
| Client not found | 400 | "Client does not exist..." |
| Invalid input | 400 | "Validation failed..." |
| Apigee API failure | 500 | "Failed to generate API key..." |
| Database error | 500 | "Database operation failed..." |
| Authorization failure | 401 | "Unauthorized access" |

---

## Configuration

### Application Properties

**Backend Configuration (`application.properties`):**

```properties
# ===============================
# SERVER
# ===============================
server.port=9000
server.address=0.0.0.0
server.servlet.context-path=/

# ===============================
# EstateWS Backend URL
# ===============================
estatews.base.url=http://estatews:9000
# OR for development: http://localhost:9000

# ===============================
# DATABASE (for future use)
# ===============================
spring.datasource.url=jdbc:postgresql://localhost:5432/EstateMgmt
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# ===============================
# LOGGING
# ===============================
logging.level.root=INFO
logging.level.org.springframework=WARN
logging.file.name=logs/estateui.log

# ===============================
# ACTUATOR (Health checks)
# ===============================
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=always
```

### Frontend Environment Variables

**Development (`.env.dev`):**
```
VITE_API_BASE_URL=http://localhost:9000
VITE_LOG_LEVEL=debug
VITE_APP_NAME=EstateUI-Dev
```

**Production:**
```
VITE_API_BASE_URL=https://estateui.fiserv.com
VITE_LOG_LEVEL=info
VITE_APP_NAME=EstateUI
```

---

## Flow Diagrams

### User Flow: Add New Device

```
┌──────────────────────────────┐
│ Support Staff navigates to   │
│ Device Key → Add Device      │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ Add Device Form appears  │
        │                          │
        │ Fields:                  │
        │ - Serial Number          │
        │ - ChMid                  │
        │ - ChTid                  │
        │ - Vendor (dropdown)      │
        │ - Client (dropdown)      │
        │ - Email                  │
        └──────────────┬───────────┘
                       │
                       │ User fills form + validates
                       │
                       ▼
        ┌──────────────────────────┐
        │ Click "Board Device"     │
        │ Form validation triggered│
        │ - Check required fields  │
        │ - Check format           │
        │ - Show errors if invalid │
        └──────────────┬───────────┘
                       │
                       │ All valid
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ POST /api/estate-ws-proxy/        │
        │     v1/terminal/boardNewDevice   │
        │ {                                │
        │   serialNumber: "POS-001",       │
        │   chMid: "123456",               │
        │   chTid: "789",                  │
        │   vendorId: "Ingenico",          │
        │   clientId: "ClientA",           │
        │   emailId: "ops@client.com",     │
        │   userName: "admin"              │
        │ }                                │
        └──────────────┬───────────────────┘
                       │
                       │ EstateWsProxyController
                       │ receives request
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ ApiProxyService                  │
        │                                  │
        │ 1. Build target URL:             │
        │    http://estatews:9000 +        │
        │    /api/v1/terminal/             │
        │    boardNewDevice                │
        │                                  │
        │ 2. POST request via RestClient   │
        │                                  │
        │ 3. Receive response              │
        │    {                             │
        │      statusCode: 200,            │
        │      data: "Device boarded...",  │
        │      status: "success"           │
        │    }                             │
        │                                  │
        │ 4. Return GenericResponse        │
        └──────────────┬───────────────────┘
                       │
                       │ EstateWsProxyController
                       │ returns response
                       │
                       ▼
        ┌──────────────────────────┐
        │ Frontend receives 200 OK │
        │ with response body       │
        └──────────────┬───────────────────┐
                       │                   │
                       │ Success           │ Error
                       │                   │
                       ▼                   ▼
        ┌────────────────────┐ ┌──────────────────┐
        │ Show success toast │ │ Show error toast │
        │ "Device boarded    │ │ Show error msg   │
        │  successfully"     │ │ Keep form open   │
        │                    │ │ for correction   │
        │ Clear form inputs  │ └──────────────────┘
        │ Redirect to List   │
        │ Devices view       │
        └────────────────────┘
```

### Refresh Device Key Flow

```
┌────────────────────────────────┐
│ Support Staff navigates to     │
│ Device Key → Generate/Refresh  │
└────────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Show device search/selection   │
    │ - Search by serial number      │
    │ - Filter by vendor/client      │
    │ - Select device               │
    └────────────┬───────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Display device details             │
    │ - Current key (masked)             │
    │ - Last refresh date                │
    │ - Status                           │
    │                                    │
    │ "Refresh Key" button               │
    └────────────┬───────────────────────┘
                 │
                 │ User clicks "Refresh"
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Confirmation dialog                │
    │ "Are you sure you want to          │
    │ refresh the API key? This will     │
    │ affect device authentication."     │
    │                                    │
    │ [Cancel] [Confirm Refresh]         │
    └────────────┬───────────────────────┘
                 │
                 │ User confirms
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Show loading indicator              │
    │ "Generating new API key..."         │
    │                                    │
    │ POST /api/estate-ws-proxy/         │
    │    v1/terminal/                    │
    │    refreshterminalkey              │
    │ {                                  │
    │   serialNumber: "POS-001",         │
    │   chMid: "123456",                 │
    │   chTid: "789",                    │
    │   userName: "admin"                │
    │ }                                  │
    └────────────┬───────────────────────┘
                 │
                 │ EstateWsProxyController
                 │ TerminalService on EstateWS
                 │
                 │ Process:
                 │ 1. Fetch current device
                 │ 2. Save old key to audit
                 │ 3. Call Apigee → new key
                 │ 4. Encrypt with vendor key
                 │ 5. Update database
                 │ 6. Create tracking entry
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Response received from EstateWS    │
    │ {                                  │
    │   statusCode: 200,                 │
    │   data: "Key refreshed...",        │
    │   status: "success"                │
    │ }                                  │
    └────────────┬────────────┬──────────┘
                 │            │
                 │ Success    │ Error
                 │            │
                 ▼            ▼
    ┌──────────────────┐ ┌──────────────────┐
    │ Hide loading     │ │ Show error toast │
    │                  │ │                  │
    │ Show success     │ │ Show error details
    │ toast message    │ │                  │
    │ "Key refreshed   │ │ Suggest retry    │
    │  successfully"   │ │                  │
    │                  │ │ Option to contact
    │ Update device    │ │ support          │
    │ display:         │ │                  │
    │ - New date       │ └──────────────────┘
    │ - New status     │
    │ (if changed)     │
    │                  │
    │ Auto-reload      │
    │ device details   │
    └──────────────────┘
```

### Bulk Upload Flow

```
┌────────────────────────────────┐
│ Support Staff navigates to     │
│ Bulk Operations → File Upload  │
└────────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────────────┐
    │ Bulk Upload Form                   │
    │                                    │
    │ 1. Select operation:               │
    │    [Enable/Disable CH]             │
    │                                    │
    │ 2. Upload CSV/Excel file           │
    │    - File input with drag-drop     │
    │    - File size validation          │
    │    - Format validation             │
    │                                    │
    │ 3. Format Guidelines displayed     │
    │    - Required columns              │
    │    - Example header shown          │
    │                                    │
    │ 4. "Preview" button                │
    └────────────┬───────────────────────┘
                 │
                 │ User selects file
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ File validation (client-side)      │
    │ - Check file type (CSV/XLSX)       │
    │ - Check file size                  │
    │ - Parse file contents              │
    │ - Validate row count               │
    │ - Validate required columns        │
    └────────────┬───────┬───────────────┘
                 │       │
                 │ Valid │ Invalid
                 │       │
                 ▼       ▼
    ┌──────────────┐ ┌──────────────────┐
    │ Show preview │ │ Show error       │
    │ table        │ │ "File format     │
    │              │ │ invalid. Rows    │
    │ Columns:     │ │ X-Y have errors" │
    │ - SerialNum  │ │                  │
    │ - Status     │ │ Show offending   │
    │ - Validation │ │ rows highlighted │
    │              │ │                  │
    │ Rows:        │ │ [Download sample │
    │ 1000+        │ │  template]       │
    │ colored      │ │                  │
    │              │ │ [Upload new file]
    │              │ └──────────────────┘
    │              │
    │ Validation   │
    │ results:     │
    │ ✓ 995 valid  │
    │ ✗ 5 errors   │
    │              │
    │ [Download    │
    │  error log]  │
    │              │
    │ [Upload]     │
    │ [Cancel]     │
    └────────────┬─┘
                 │
                 │ User clicks Upload
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Show confirmation dialog           │
    │ "You are about to enable CH for    │
    │ 995 devices. This cannot be        │
    │ undone immediately. Proceed?"      │
    │                                    │
    │ [Cancel] [Proceed]                 │
    └────────────┬───────────────────────┘
                 │
                 │ User clicks Proceed
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Upload & Process                   │
    │                                    │
    │ Progress bar showing:              │
    │ - Uploaded: 250/995                │
    │ - Processing: 240/995              │
    │ - Success: 235                     │
    │ - Failed: 5                        │
    │                                    │
    │ Estimated time: 2 min 30 sec       │
    │                                    │
    │ POST /api/estate-ws-proxy/         │
    │    v1/terminal/bulkrefreshterminal │
    │    key?terminalIds=1,2,3,...       │
    │                                    │
    │ Multiple parallel requests         │
    │ (batched for performance)          │
    └────────────┬───────────────────────┘
                 │
                 │ Processing completes
                 │
                 ▼
    ┌────────────────────────────────────┐
    │ Results Summary                    │
    │                                    │
    │ ✓ Processed: 995 devices           │
    │ ✓ Success: 990                     │
    │ ✗ Failed: 5                        │
    │ - Success rate: 99.5%              │
    │                                    │
    │ Failed devices:                    │
    │ SerialNum         | Error          │
    │ POS-0042          | Not found      │
    │ POS-0055          | Invalid key    │
    │ ...               | ...            │
    │                                    │
    │ [Download report]                  │
    │ [Download failed list]             │
    │ [View details]                     │
    │ [Return to form]                   │
    └────────────────────────────────────┘
```

---

## Development & Testing

### Frontend Development

**Local Development Setup:**
```bash
# Install dependencies
cd frontend
npm install

# Start dev server with HMR (Hot Module Replacement)
npm run dev
# Available at http://localhost:5173 (Vite default)

# With specific environment
npm run start:dev

# Production build simulation
npm run build
npm run preview
```

**Testing Strategy:**
- Unit tests for services (Jest)
- Component tests (React Testing Library)
- E2E tests (Cypress/Playwright) for critical flows
- Manual testing in staging environment

### Backend Development

**Local Development Setup:**
```bash
# Build with frontend embedded
mvn clean package -DskipTests

# Run application
java -jar target/estateui-0.0.1-SNAPSHOT.jar

# Alternative: run in IDE with DevTools
# Run Application.java main method
# Access at http://localhost:9000
```

---

## Deployment Checklist

- [ ] Frontend dependencies installed and verified
- [ ] React components tested locally
- [ ] Backend API proxy tested with EstateWS
- [ ] Maven build successful (both frontend + backend)
- [ ] Docker image built and tested locally
- [ ] Environment variables configured
- [ ] EstateWS backend connectivity verified
- [ ] Database connection verified (if using local DB)
- [ ] Logging configured properly
- [ ] Health check endpoints responding
- [ ] CORS configured (if needed)
- [ ] Static assets (React bundle) included in JAR
- [ ] Security headers configured
- [ ] Error handling tested
- [ ] API timeout values configured
- [ ] Load testing performed
- [ ] Documentation updated
- [ ] Team trained on application usage

---

*Document Version: 1.0*  
*Last Updated: April 6, 2026*  
*Status: Complete Architecture Document - EstateUI*




========

DOC 3

fdpos_services_design.md


# FDPOS Services - Architecture & Design Document

**Project Name:** FDPOS Services (First Data Point of Sale Services)  
**Version:** 2.0.0  
**Organization:** Fiserv (formerly First Data)  
**Application Type:** Enterprise Spring Framework Web Application (WAR Deployment)  
**Documentation Date:** April 6, 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Core Components](#core-components)
6. [Message Processing Pipeline](#message-processing-pipeline)
7. [Database Schema](#database-schema)
8. [Kafka Integration](#kafka-integration)
9. [Scheduler & Batch Processing](#scheduler--batch-processing)
10. [Entity & Data Models](#entity--data-models)
11. [REST Controllers & APIs](#rest-controllers--apis)
12. [Configuration & Properties](#configuration--properties)
13. [Deployment](#deployment)
14. [Error Handling & Monitoring](#error-handling--monitoring)
15. [Flow Diagrams](#flow-diagrams)

---

## Executive Summary

**FDPOS Services** is an enterprise-grade **event-driven batch processing system** built on Spring Framework for managing merchant onboarding and lifecycle operations. The system:

- **Consumes Kafka events** from UMM (Unified Merchant Management) system in two regional data centers (North and Omaha)
- **Stages messages** in Oracle database tables for asynchronous processing
- **Processes merchant events** via a scheduled batch processor that runs every 1 minute
- **Updates merchant data** in multiple derived tables based on event types (ADD, UPDATE, DELETE, etc.)
- **Provides REST APIs** for merchant data queries and management operations
- **Maintains audit trails** with comprehensive message tracking and correlation IDs

**Key Characteristics:**
- Traditional Spring Framework (not Spring Boot)
- WAR deployment on standalone Tomcat server
- Event-driven architecture with dual Kafka listener infrastructure
- Scheduled batch processing with distributed locking
- Environment-specific property management
- Comprehensive event tracking with message correlation

---

## System Overview

### Purpose & Scope

FDPOS Services acts as the **central merchant data processing hub** for Fiserv's point-of-sale ecosystem, bridging UMM producer events with FDPOS consumer databases.

### Business Context

```
UMM System                    FDPOS Services              Data Warehouse
(Kafka Producer)              (This Application)          (Oracle DB)
     │                              │                            │
     ├─ Merchant ADD events         │                            │
     ├─ Merchant UPDATE events ────→ Kafka Topics ────────────→ FDPOS Datasets
     ├─ Merchant DELETE events      │ (2 regions)               │
     └─ Other events               │                            │
                                    │
                                    ├─ Stage messages
                                    ├─ Process via scheduler  
                                    ├─ Update facts tables
                                    └─ Maintain audit trail
```

### Key Responsibilities

1. **Event Ingestion** - Consume UMM events from two Kafka clusters (North & Omaha)
2. **Message Staging** - Store raw events in stage tables with metadata
3. **Event Processing** - Batch process staged messages every 1 minute
4. **Data Transformation** - Transform merchant events into analytic datasets
5. **API Services** - Provide REST endpoints for merchant data queries
6. **Audit & Tracking** - Maintain comprehensive event tracking and processing history
7. **Configuration Management** - Support multi-environment deployments with property files

### Target Users & Systems

| Consumer | Use Case |
|----------|----------|
| **Analytics Dashboards** | Reports on merchant onboarding trends |
| **Data Warehouse** | Fact tables for BI analytics |
| **Merchant Services** | Merchant data queries and updates |
| **Risk & Compliance** | Merchant status and audit trails |
| **POS Terminal Systems** | Terminal-to-merchant mappings |

---

## Architecture Overview

### High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          UMM Producer System                               │
│                    (Merchant Change Events)                                │
└──────────┬────────────────────────────────────────────────────┬────────────┘
           │                                                    │
           │ Kafka Events (North Region)                       │ Kafka Events (Omaha Region)
           │ - Topic: fiserv-umm-north-merchant-change-v1     │ - Topic: fiserv-umm-omaha-merchant-change-v1
           │ - Group: umm-fdpos-consumer-group                │ - Group: umm-fdpos-consumer-group
           │                                                    │
           ▼                                                    ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                     FDPOS Services Application                          │
    │                  (Spring Framework WAR on Tomcat)                       │
    │                                                                         │
    │  ┌─────────────────────────────────────────────────────────────────┐   │
    │  │  Kafka Listeners (Parallel Processing)                         │   │
    │  │  - UmmKafkaListenerNorth (North region consumer)               │   │
    │  │  - UmmKafkaListenerOmaha (Omaha region consumer)               │   │
    │  │                                                                 │   │
    │  │  Processes:                                                    │   │
    │  │  1. Deserialize JSON message                                   │   │
    │  │  2. Create UmmNotification object                              │   │
    │  │  3. Invoke UmmNotificationService.process()                    │   │
    │  └────────────────┬────────────────────────────────────┬──────────┘   │
    │                   │                                    │               │
    │  ┌────────────────▼────────────────────────────────────▼──────────┐   │
    │  │  Data Access Layer (Message Staging)                         │   │
    │  │  - StageUmmDataDao (North stage table)                        │   │
    │  │  - StageUmmDataOmahaDao (Omaha stage table)                   │   │
    │  │                                                                │   │
    │  │  Stores:                                                      │   │
    │  │  - Raw message JSON (BEFOREDATA, AFTERDATA CLOBs)            │   │
    │  │  - Message metadata (ID, offset, timestamp)                   │   │
    │  │  - Processing flags (status, start/end time)                  │   │
    │  └────────────────┬───────────────────────────────────┬──────────┘   │
    │                   │                                    │               │
    │  ┌────────────────▼────────────────────────────────────▼──────────┐   │
    │  │  Oracle Database (Staging Layer)                             │   │
    │  │  - CTMS.STAGE_UMM_DATA (North stage table)                   │   │
    │  │  - CTMS.STAGE_UMM_DATA_OMAHA (Omaha stage table)             │   │
    │  │                                                                │   │
    │  │  Columns: MessageID, MerchantID, Status, Data, Timestamps    │   │
    │  └────────────────┬───────────────────────────────────┬──────────┘   │
    │                   │                                    │               │
    │  ┌────────────────▼────────────────────────────────────▼──────────┐   │
    │  │  Scheduled Batch Processor (Every 1 Minute)                  │   │
    │  │  - MerchantBoardingDynamicSchedulerConfig                    │   │
    │  │  - NorthMerchantBoardingScheduler                            │   │
    │  │  - OmahaMerchantBoardingScheduler                            │   │
    │  │                                                                │   │
    │  │  Processes:                                                  │   │
    │  │  1. Fetch staged messages (ADD, UPDATE, DELETE, OTHER)       │   │
    │  │  2. Lock messages for processing (distributed locking)       │   │
    │  │  3. Process each message via MerchantBatchProcessor          │   │
    │  │  4. Update status to SUCCESS/FAILED                          │   │
    │  │  5. Record end time for audit trail                          │   │
    │  └────────────────┬───────────────────────────────────┬──────────┘   │
    │                   │                                    │               │
    │  ┌────────────────▼────────────────────────────────────▼──────────┐   │
    │  │  Business Logic Services                                      │   │
    │  │  - MerchantActionService (ADD/UPDATE/DELETE processing)      │   │
    │  │  - MerchantBatchProcessor (Batch orchestration)              │   │
    │  │  - NotificationConverter (JSON deserialization)              │   │
    │  │                                                                │   │
    │  │  Updates derived tables based on event type                   │   │
    │  └────────────────┬───────────────────────────────────┬──────────┘   │
    │                   │                                    │               │
    │  ┌────────────────▼────────────────────────────────────▼──────────┐   │
    │  │  REST Controller Layer (Query & Management APIs)             │   │
    │  │  - UMMCommonController                                        │   │
    │  │  - ClientUMMController                                        │   │
    │  │  - UMMEntitlementController                                   │   │
    │  │  - UMMPartyHierarchyController                                │   │
    │  │  - UMMXrefController                                          │   │
    │  │  - ClientSuppliesUMMController                                │   │
    │  │  - ClientChainingUMMController                                │   │
    │  └────────────────┬───────────────────────────────────┬──────────┘   │
    │                   │                                    │               │
    └───────────────────┼────────────────────────────────────┼───────────────┘
                        │                                    │
                        ▼                                    ▼
            ┌──────────────────────────────┐    ┌──────────────────────────────┐
            │  Oracle Database (CTMS)      │    │  Oracle Database (FDPOS)     │
            │                              │    │                              │
            │  Fact Tables:                │    │  Merchant Datasets:          │
            │  - CLIENT_UMM                │    │  - Merchant profiles         │
            │  - ENTITLEMENTS              │    │  - Entitlements              │
            │  - PARTY_HIERARCHY           │    │  - Party hierarchies         │
            │  - XREF_DATA                 │    │  - Cross-references          │
            │  - SUPPLIES                  │    │  - Program Express mappings  │
            │  - PROGRAM_EXPRESS           │    │                              │
            │  - CHAINING                  │    │                              │
            │                              │    │                              │
            │  (Updated by scheduler)      │    │  (Reported & Consumed)       │
            └──────────────────────────────┘    └──────────────────────────────┘
```

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│   REST API Layer                                        │
│   - UMMCommonController                                 │
│   - ClientUMMController                                 │
│   - UMMEntitlementController                            │
│   - Query merchant data, trigger operations             │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│   Service Layer (Business Logic)                        │
│   - MerchantActionService (Process ADD/UPDATE/DELETE)   │
│   - MerchantBatchProcessor (Batch orchestration)        │
│   - NotificationConverter (Deserialization)             │
│   - Transformation logic & validation                   │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│   Data Access Layer (DAO/Repository)                   │
│   - StageUmmDataDao                                     │
│   - ClientUmmRepository                                 │
│   - EntitlementRepository                               │
│   - PartyHierarchyRepository                            │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│   Framework Layer                                       │
│   - Kafka Listeners & Consumers                         │
│   - Scheduled Task Executor                             │
│   - Spring Configuration & Beans                        │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│   External Systems                                      │
│   - Oracle Database (CTMS & FDPOS schemas)              │
│   - Kafka Clusters (AWS MSK North & Omaha)              │
│   - Tomcat Application Server                           │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Framework** | 6.2.17 | Core web framework (NOT Spring Boot) |
| **Spring Web MVC** | 6.2.17 | REST controller framework |
| **Spring Data** | 2023.1.4 | JPA/Hibernate abstraction |
| **Hibernate** | 6.4.4 | ORM framework |
| **Java** | 17 | Programming language |
| **Maven** | 3.x | Build tool |

### Message Queue & Event Processing

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Kafka** | Latest | Kafka consumer/producer integration |
| **Apache Kafka** | Latest | Distributed event streaming |
| **AWS MSK** | Managed | Managed Kafka service (North & Omaha) |
| **Confluent Cloud** | N/A | Alternative Kafka provider (commented out) |

### Database & Persistence

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Oracle JDBC Driver** | 21.5.0.0 | Database connectivity |
| **HikariCP** | 4.0.3 | Connection pooling |
| **Hibernate Validator** | 6.2.3 | Bean validation |

### Security & Encryption

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Security** | 6.5.9 | Authentication & authorization |
| **Voltage SecureData** | 2.2.1 | Data encryption/masking |
| **OWASP HTML Sanitizer** | 20220608.1 | XSS protection |

### Utilities

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Apache Commons Lang3** | 3.18.0 | Utility functions |
| **Jackson** | 2.18.6 | JSON serialization (CVE updated) |
| **Lombok** | 1.18.24 | Reduce boilerplate code |
| **MapStruct** | 1.5.1 | Bean mapping |
| **SLF4J / Log4j2** | Latest | Logging framework (CVE updated) |
| **Bucket4j** | 6.4.1 | Rate limiting |
| **AspectJ** | 1.9.21 | AOP framework |

### Testing

| Technology | Version | Purpose |
|-----------|---------|---------|
| **JUnit 5** | 5.10.2 | Unit testing |
| **Mockito** | 5.2.0 | Mocking framework |
| **ArchUnit** | 0.23.1 | Architecture testing |

---

## Core Components

### 1. Kafka Listener Infrastructure

#### UmmKafkaListenerNorth

**Purpose:** Consume UMM merchant change events from North Kafka cluster

```java
@Service
@ConditionalOnProperty(name = "umm.kafka.north.listener.enabled", havingValue = "true")
public class UmmKafkaListenerNorth {
  
  @KafkaListener(
    topics = "${umm.kafka.north.message-topic:fiserv-umm-north-merchant-change-topic-v1}",
    groupId = "${umm.kafka.north.message-group:umm-fdpos-consumer-group}",
    containerFactory = "ummKafkaListenerContainerFactoryNorth"
  )
  public void listen(ConsumerRecord<String, String> ummNotificationRecord);
}
```

**Flow:**
```
1. Receive ConsumerRecord from Kafka
2. Extract JSON string from message value
3. Check if processing enabled (fdpos.umm.kafka.north.process.enabled)
4. If enabled:
   - Deserialize JSON → UmmNotification object
   - Invoke UmmNotificationService.process()
   - Pass Kafka offset for tracking
5. If error:
   - Log exception
   - Throw UMMServiceException
   - Message goes to Dead Letter Queue (DLQ)
```

**Message Format (JSON):**
```json
{
  "messageId": "uuid-12345",
  "notificationDate": "2026-04-06T10:30:00Z",
  "source": "UMM",
  "subject": "MerchantOnboarding",
  "action": "ADD",  // ADD, UPDATE, DELETE, etc.
  "merchantId": "MERC-001",
  "platform": "FDPOS",
  "beforeData": "...JSON of previous state...",
  "afterData": "...JSON of new state...",
  "testingStatus": "P"  // P=Production
}
```

#### UmmKafkaListenerOmaha

**Similar to North listener, but for Omaha region** with separate Kafka cluster and stage table.

**Dual-Region Strategy:**
- North Kafka → STAGE_UMM_DATA table
- Omaha Kafka → STAGE_UMM_DATA_OMAHA table
- Both processed independently by separate schedulers
- Allows regional failure isolation

---

### 2. Configuration Layer

#### UmmListenerConfigNorth

**Purpose:** Configure Kafka consumer for North region with SASL/SSL security

```java
@EnableKafka
@Configuration
@ConditionalOnProperty(name = "umm.kafka.north.listener.enabled", havingValue = "true")
public class UmmListenerConfigNorth {
  
  // Key settings:
  // - SASL_SCRAM authentication (MSK)
  // - Auto-offset-reset: latest
  // - Session timeout: 30 seconds
  // - Heartbeat: 10 seconds
  // - Max idle: 9 minutes
  // - Concurrency: Configurable from properties
}
```

**Security Configuration:**
```
Bootstrap Servers: msk-bootstrap.umm-nonprod.aws.fisv.cloud:9000
Security Protocol: SASL_SSL
SASL Mechanism: SCRAM-SHA-512
Username: umm_event_consumer_fdpos
Password: [from properties]
SSL Endpoint ID: https
```

#### ListenerPropertiesNorth

**Purpose:** Encapsulate Kafka properties from application.properties**

```
umm.kafka.north.bootstrap.server
umm.kafka.north.message-topic
umm.kafka.north.message-group
umm.kafka.north.username
umm.kafka.north.password
umm.kafka.north.security.protocol
umm.kafka.north.security.sasl.mechanism
umm.kafka.north.max-poll-records
umm.kafka.north.concurrency
```

#### MerchantBoardingDynamicSchedulerConfig

**Purpose:** Configure dynamic cron-based scheduler**

```java
@EnableScheduling
@Configuration
public class MerchantBoardingDynamicSchedulerConfig implements SchedulingConfigurer {
  
  @Override
  public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
    taskRegistrar.addTriggerTask(
      merchantBoardingScheduler::processMerchantBoarding,
      triggerContext -> {
        String cron = merchantBoardingScheduler.getCronExpression();
        return new CronTrigger(cron).nextExecution(triggerContext);
      }
    );
  }
}
```

**Benefits:**
- Cron expression can be changed at runtime via properties
- No application restart needed
- Supports different intervals per environment

---

### 3. Scheduler & Batch Processor

#### NorthMerchantBoardingScheduler

**Purpose:** Process staged merchant boarding messages every 1 minute (configurable)

**Execution Flow:**
```
1. Start with MDC correlation ID (for distributed tracing)
2. Fetch threshold limit (default: 100 messages)
3. Fetch & lock ADD messages (STARTTIME = NULL, STATUS = PENDING)
4. Fetch & lock UPDATE messages
5. Fetch & lock DELETE/OTHER messages (excluding already locked merchants)
6. Process skip messages (messages that failed before)
7. Invoke MerchantBatchProcessor for each category
8. Record STARTTIME and ENDTIME for audit
9. Update STATUSFLAG based on processing result
```

**Concurrency Control:**
- Uses database locking (FOR UPDATE NOWAIT)
- Multiple scheduler instances can run without conflicts
- STARTTIME column acts as processing lock indicator
- Prevents duplicate processing of same message

**Configuration Parameters:**
```
fdpos.umm.scheduler.availableLimit = 100       # Max messages per run
fdpos.umm.scheduler.defaultSkipLimit = 25      # Retry failed messages
fdpos.umm.scheduler.cron.expression = "0 * * * * ?" # Every minute
```

**Scheduler Components:**

| Component | Responsibility |
|-----------|-----------------|
| `StageUmmDataDao` | Fetch and lock messages from staging table |
| `MerchantBatchProcessor` | Orchestrate message processing |
| `MerchantActionService` | Execute ADD/UPDATE/DELETE operations |
| `Environment` | Get server name for audit trail |
| `Properties` | Dynamic property lookup |

---

### 4. Message Processing Pipeline

#### NotificationConverter

**Purpose:** Deserialize JSON messages into UmmNotification objects

```java
public UmmNotification deserialize(String jsonString)
  // Parse JSON
  // Create UmmNotification DTO
  // Extract beforeData and afterData
  // Return populated object
```

#### UmmNotificationService (interface)

```java
public interface UmmNotificationService {
  void process(long messageOffset, UmmNotification ummNotification) throws Exception;
}
```

**Implementation Flow:**
1. Accept deserialized notification
2. Store raw message in STAGE_UMM_DATA table
3. Set status flag to PENDING
4. Record creation date and offset
5. Commit transaction immediately (async processing)

#### MerchantBatchProcessor

**Purpose:** Orchestrate batch processing of staged messages

**Processing Strategy:**
```
1. Group messages by action type (ADD, UPDATE, DELETE, OTHER)
2. For each action:
   a. Extract merchant data from beforeData/afterData
   b. Validate data
   c. Call MerchantActionService
3. Handle errors gracefully:
   - Catch exceptions
   - Mark message with error status
   - Manual intervention for failed messages
```

#### MerchantActionService

**Purpose:** Execute actual merchant data changes

**Operations:**
- **ADD** - Insert new merchant in fact tables
- **UPDATE** - Update existing merchant data
- **DELETE** - Soft/hard delete merchant
- **OTHER** - Handle custom actions

---

### 5. REST Controller Layer

#### UMMCommonController

**Purpose:** Common queries for merchant data

```
GET  /api/umm/merchants/{merchantId}      - Fetch merchant details
GET  /api/umm/merchants                   - List merchants with filters
GET  /api/umm/merchants/search            - Advanced search
```

#### ClientUMMController

**Purpose:** Client-specific operations

```
GET  /api/umm/clients/{clientId}/merchants
POST /api/umm/clients/{clientId}/merchants
```

#### UMMEntitlementController

**Purpose:** Entitlement data management

```
GET  /api/umm/entitlements/{merchantId}
POST /api/umm/entitlements
```

#### UMMPartyHierarchyController

**Purpose:** Party hierarchy relationships

```
GET  /api/umm/party-hierarchy/{merchantId}
```

#### UMMXrefController

**Purpose:** Cross-references between systems

```
GET  /api/umm/xref/{externalId}
```

#### ClientSuppliesUMMController & ClientChainingUMMController

**Purpose:** Supplies and chaining relationship management

---

## Message Processing Pipeline

### End-to-End Message Flow

```
Step 1: Kafka Event Production (UMM System)
├─ Merchant service sends merchant change event
├─ Event published to Kafka topic (with UUID)
└─ Event contains before/after state (JSON)

Step 2: Kafka Event Ingestion (This Application)
├─ UmmKafkaListenerNorth/Omaha receives message
├─ Check if processing enabled (property-driven)
├─ Deserialize message to UmmNotification
└─ Invoke UmmNotificationService

Step 3: Message Staging
├─ UmmNotificationService stores raw message
├─ Create StageUmmData entity:
│  ├─ MESSAGEID = UUID from message
│  ├─ MERCHANTID = extracted from message
│  ├─ NOTIFICATIONDATE = message producer timestamp
│  ├─ CREATEDDATE = now() (listener reception time)
│  ├─ BEFOREDATA = original state (CLOB)
│  ├─ AFTERDATA = new state (CLOB)
│  ├─ STATUSFLAG = PENDING (P)
│  ├─ STARTTIME = NULL (not yet processed)
│  ├─ ENDTIME = NULL
│  ├─ MSG_OFFSET = Kafka offset
│  └─ SERVERNAME = NULL (populated by scheduler)
├─ Insert/update in STAGE_UMM_DATA (North) or STAGE_UMM_DATA_OMAHA (Omaha)
└─ Return immediately (async processing)

Step 4: Scheduler Picks Up (Every 1 Minute)
├─ NorthMerchantBoardingScheduler.processMerchantBoarding() runs
├─ Call StageUmmDataDao.fetchAndUpdateAddMessages():
│  ├─ SELECT * FROM STAGE_UMM_DATA WHERE STATUSFLAG = 'P' AND ACTION = 'ADD'
│  ├─ FOR UPDATE NOWAIT (lock rows)
│  ├─ UPDATE STARTTIME = now(), SERVERNAME = hostname
│  └─ Return locked records (up to limit)
├─ Similarly fetch UPDATE and OTHER messages
├─ Total fetched cannot exceed threshold (default: 100)
└─ Continue with processing

Step 5: Message Processing
├─ Extract merchant data from AFTERDATA JSON
├─ Map to merchant entity
├─ Validate merchant data
├─ Call MerchantActionService:
│  ├─ For ADD: insert into CLIENT_UMM, ENTITLEMENTS, etc.
│  ├─ For UPDATE: update existing records
│  ├─ For DELETE: mark as deleted
│  └─ Return success/failure
├─ Handle exceptions:
│  ├─ Catch any processing error
│  ├─ Mark as FAILED
│  ├─ Record error message
│  └─ Continue with next message
└─ Commit transaction

Step 6: Audit & Tracking
├─ Update STATUSFLAG:
│  ├─ SUCCESS (S) if no errors
│  ├─ FAILED (F) if error occurred
│  └─ PROCESSING (PR) if still in progress
├─ Record ENDTIME = now()
├─ Maintain MDC correlation ID for tracing
└─ Log processing summary (added/updated/deleted counts)

Step 7: Fact Table Updates (Multiple tables)
├─ CLIENT_UMM - core merchant data
├─ ENTITLEMENTS - service entitlements
├─ PARTY_HIERARCHY - organization structure
├─ XREF_DATA - external system mappings
├─ SUPPLIES - supply chain data
├─ PROGRAM_EXPRESS - program mappings
└─ CHAINING - merchant chaining relationships

Step 8: Downstream Consumption
├─ BI/Analytics tools read from fact tables
├─ Dashboards display merchant metrics
├─ Risk/Compliance tools query history
└─ POS systems reference merchant master
```

### Key Timing Metrics

| Metric | Expected Value | Critical |
|--------|-----------------|----------|
| NOTIFICATIONDATE → CREATEDDATE | < 100ms | Yes (producer lag) |
| CREATEDDATE → STARTTIME | < 60 seconds | No (scheduler delay) |
| STARTTIME → ENDTIME | < 10 seconds | No (processing time) |
| Message to Fact Table | < 70 seconds | Yes (total SLA) |
| Scheduler cycle | 60 seconds | Yes (batch window) |

---

## Database Schema

### Stage Tables (Message Queue)

#### CTMS.STAGE_UMM_DATA (North)

```sql
CREATE TABLE CTMS.STAGE_UMM_DATA (
  UNIQUEID             NUMBER PRIMARY KEY,           -- PK (Oracle sequence)
  MESSAGEID            VARCHAR2(500),                -- UUID from Kafka message
  NOTIFICATIONDATE     DATE,                         -- Producer timestamp
  SOURCE               VARCHAR2(100),                -- Message source (UMM)
  SUBJECT              VARCHAR2(100),                -- Subject/category
  ACTION               VARCHAR2(50),                 -- ADD, UPDATE, DELETE, etc.
  MERCHANTID           VARCHAR2(30),                 -- Merchant identifier
  PLATFORM             VARCHAR2(50),                 -- Platform (FDPOS)
  BEFOREDATA           CLOB,                         -- Original state (JSON)
  AFTERDATA            CLOB,                         -- New state (JSON)
  STATUSFLAG           VARCHAR2(10),                 -- P=Pending, S=Success, F=Failed
  STARTTIME            DATE,                         -- Scheduler start time
  ENDTIME              DATE,                         -- Scheduler end time
  TESTING_STATUS       CHAR(1),                      -- P=Production, T=Testing
  MSG_OFFSET           NUMBER(20),                   -- Kafka offset
  CREATEDDATE          DATE,                         -- Listener receipt time
  SERVERNAME           VARCHAR2(50)                  -- Server that processed
);

-- Indices
CREATE INDEX idx_stage_umm_status ON STAGE_UMM_DATA(STATUSFLAG, ACTION);
CREATE INDEX idx_stage_umm_merchant ON STAGE_UMM_DATA(MERCHANTID);
CREATE INDEX idx_stage_umm_date ON STAGE_UMM_DATA(CREATEDDATE);
```

#### CTMS.STAGE_UMM_DATA_OMAHA

**Identical schema to STAGE_UMM_DATA**, separate table for Omaha region

### Fact Tables (Derived Data)

#### CTMS.CLIENT_UMM

Core merchant/client master data

```sql
CREATE TABLE CTMS.CLIENT_UMM (
  CLIENT_ID            NUMBER PRIMARY KEY,
  MERCHANT_ID          VARCHAR2(30),                 -- Source merchant ID
  MERCHANT_NAME        VARCHAR2(255),
  MERCHANT_STATUS      VARCHAR2(50),
  -- ... additional merchant columns
  CREATED_DATE         DATE,
  UPDATED_DATE         DATE,
  SOURCE_SYSTEM        VARCHAR2(50),                 -- UMM source
  MESSAGE_ID           VARCHAR2(500)                 -- Source message correlation
);
```

#### CTMS.ENTITLEMENTS

Service/product entitlements

```sql
CREATE TABLE CTMS.ENTITLEMENTS (
  ENTITLEMENT_ID       NUMBER PRIMARY KEY,
  CLIENT_ID            NUMBER REFERENCES CLIENT_UMM,
  SERVICE_CODE         VARCHAR2(50),
  ENTITLEMENT_STATUS   VARCHAR2(50),
  EFFECTIVE_DATE       DATE,
  END_DATE             DATE
);
```

#### CTMS.PARTY_HIERARCHY

Organizational relationships

```sql
CREATE TABLE CTMS.PARTY_HIERARCHY (
  HIERARCHY_ID         NUMBER PRIMARY KEY,
  PARENT_MERCHANT_ID   VARCHAR2(30),
  CHILD_MERCHANT_ID    VARCHAR2(30),
  RELATIONSHIP_TYPE    VARCHAR2(50),
  -- ... hierarchy structure
  MESSAGE_ID           VARCHAR2(500)
);
```

#### Additional Tables

- CTMS.XREF_DATA - External system cross-references
- CTMS.SUPPLIES - Supply chain mappings
- CTMS.PROGRAM_EXPRESS - Program Express mappings
- CTMS.CHAINING - Merchant chaining relationships

---

## Kafka Integration

### Kafka Cluster Configuration

#### MSK North Cluster

```properties
# Bootstrap server
msk-bootstrap.umm-nonprod.aws.fisv.cloud:9000

# Topics
- fiserv-umm-north-merchant-change-topic-v1

# Configuration
- Consumer Group: umm-fdpos-consumer-group
- Security: SASL_SSL with SCRAM-SHA-512
- Username: umm_event_consumer_fdpos
- Auto Offset Reset: Latest
- Session Timeout: 30 seconds
- Heartbeat: 10 seconds (keep-alive)
```

#### MSK Omaha Cluster

```properties
# Bootstrap server
msk-bootstrap.umm-nonprod.aws.fisv.cloud:9000

# Topics
- fiserv-umm-omaha-merchant-change-topic-v1

# Configuration
- Similar to North, independent consumer group processing
```

### Authentication

**SASL/SCRAM Authentication:**
```
Security Protocol: SASL_SSL
SASL Mechanism: SCRAM-SHA-512
JAAS Config: org.apache.kafka.common.security.scram.ScramLoginModule
SSL Endpoint ID: https

Username: umm_event_consumer_fdpos
Password: [stored in properties]
```

### Message Offset Management

```
Auto Offset Reset: latest
  - Start from latest offset on first run
  - Prevents reprocessing old messages

Offset Tracking:
- Kafka automatically tracks consumer offset
- Offset stored in Kafka broker
- Allow recovery from crashes
- No need for external offset store
```

### Error Handling

**Processing Failures:**
1. Exception in listener → UMMServiceException thrown
2. Spring Kafka catches exception
3. Message moved to Dead Letter Topic (DLQ)
4. Operator investigates DLQ messages
5. Manual resubmission after fix

**DLQ Configuration:**
```properties
spring.kafka.listener.ack-mode=RECORD
# Fail after exception
# Message doesn't advance offset
# Retry mechanisms available
```

---

## Scheduler & Batch Processing

### Scheduler Configuration

#### Dynamic Cron Expression

```properties
# In application-{env}.properties
fdpos.umm.scheduler.cron = "0 * * * * ?"    # Every minute
fdpos.umm.scheduler.availableLimit = 100    # Max batch size
fdpos.umm.scheduler.defaultSkipLimit = 25   # Retry failed messages
```

**Cron Format:** `second minute hour day month day_of_week`
- `0 * * * * ?` = Every minute at 0 seconds
- `0 */5 * * * ?` = Every 5 minutes
- `0 0 * * * ?` = Every hour at top of hour

### Processing Limits & Tuning

```
Message Batch Size:
- Default: 100 messages per scheduler run
- Tunable: fdpos.umm.scheduler.availableLimit
- Effects: Throughput vs database load trade-off

Skip Records (Retry):
- Default: 25 messages per run
- Tunable: fdpos.umm.scheduler.defaultSkipLimit
- Purpose: Retry previously failed messages

Scheduler Concurrency:
- Default: 1 (single scheduler thread)
- Can be increased for parallel processing
- Requires distributed locking (currently via DB)
```

### Distributed Processing

**Multiple Server Support:**
```
Multiple instances can run scheduler simultaneously:
1. Server A fetches 100 pending messages
2. Server B fetches different 100 pending messages
3. Both process independently
4. Database locking prevents conflicts

Locking Mechanism:
SELECT ... FROM STAGE_UMM_DATA ... FOR UPDATE NOWAIT
- NOWAIT: Don't wait for row lock (skip if locked)
- Prevents duplicate processing
- STARTTIME tracking indicates processing state
```

---

## Configuration & Properties

### Environment-Specific Properties

**Property File Structure:**
```
properties/
├── dev/
│   ├── r3dvap1119/                          # Dev server 1
│   │   └── application-dev.properties
│   └── r3dvap1120/                          # Dev server 2
│       └── application-dev.properties
├── qa/
│   ├── r3qaap1119/
│   └── r3qaap1120/
├── prod/
│   ├── r3prodap1119/
│   └── r3prodap1120/
└── local/
    └── application-dev.properties
```

**Deployment Process:**
1. Developer modifies properties file locally
2. Commits to Git
3. CI/CD pipeline builds application
4. During deployment to Tomcat:
   - Relevant properties file copied to Tomcat config
   - Application reads from Tomcat location
   - No properties in WAR file
   - Runtime property updates possible

### Key Properties

#### UMM North Kafka

```properties
umm.kafka.north.listener.enabled=true
umm.kafka.north.bootstrap.server=msk-bootstrap.umm-nonprod.aws.fisv.cloud:9000
umm.kafka.north.message-group=umm-fdpos-consumer-group
umm.kafka.north.message-topic=fiserv-umm-north-merchant-change-topic-v1
umm.kafka.north.username=umm_event_consumer_fdpos
umm.kafka.north.password=6*l:PPqQL
umm.kafka.north.security.login.module=org.apache.kafka.common.security.scram.ScramLoginModule
umm.kafka.north.security.protocol=SASL_SSL
umm.kafka.north.security.sasl.mechanism=SCRAM-SHA-512
```

#### Scheduler Configuration

```properties
fdpos.umm.scheduler.cron=0 * * * * ?
fdpos.umm.scheduler.availableLimit=100
fdpos.umm.scheduler.defaultSkipLimit=25
fdpos.umm.scheduler.server.name=r3dvap1119
umm.scheduler.server.name=r3dvap1119
```

#### Processing Flags

```properties
fdpos.umm.kafka.north.process.enabled=true
fdpos.umm.kafka.omaha.process.enabled=true
```

#### Database Connection

```properties
spring.datasource.url=jdbc:oracle:thin:@dbhost:1521:CTMS
spring.datasource.username=fdpos_app
spring.datasource.password=xxx
spring.datasource.driver-class-name=oracle.jdbc.driver.OracleDriver

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

---

## Deployment

### Build Process

**Maven WAR Build:**
```bash
mvn clean package
```

**Output:** `fdpos_services.war`

### Local Testing & Deployment

**Local Build & Deploy Script:**
```bash
# C:\Users\F9XQY7Z\dev\fdpos_services\build\local-build-deploy.bat

cd fdpos_services
mvn clean package
copy target/fdpos_services.war C:\tomcat\webapps\
```

### Production Deployment

**Environment-Specific WAR:**
1. Build WAR (properties not included)
2. Select environment-specific properties file
3. Copy properties to Tomcat config directory
4. Deploy WAR to Tomcat
5. Restart Tomcat application

**Deployment Steps:**
```
1. Build: mvn clean package
2. Verify WAR created: target/fdpos_services.war
3. Copy properties: properties/prod/r3prodap1119/application-prod.properties → Tomcat/conf/
4. Deploy WAR: cp fdpos_services.war $TOMCAT_HOME/webapps/
5. Start Tomcat: $TOMCAT_HOME/bin/catalina.sh start
6. Verify logs: tail -f $TOMCAT_HOME/logs/catalina.out
```

### Tomcat Configuration

**Application Context:**
- Context path: `/fdpos-services`
- Port: 8080 (default Tomcat)
- WAR name: `fdpos_services.war`

**Property File Location:**
```
$TOMCAT_HOME/conf/application-{env}.properties
```

**JVM Tuning:**
```
JAVA_OPTS="-Xms2g -Xmx4g -XX:+UseG1GC"
```

---

## Error Handling & Monitoring

### Exception Hierarchy

| Exception | When Thrown | Handling |
|-----------|------------|----------|
| `UMMServiceException` | Kafka listener failure | Log, throw to DLQ |
| `DataAccessException` | Database operation failure | Rollback, retry via scheduler |
| `ValidationException` | Invalid merchant data | Mark as FAILED, continue |
| `MappingException` | JSON deserialization error | Log, DLQ |

### Logging Strategy

**Log Levels:**
- **ERROR:** Application failures requiring attention
- **WARN:** Exceptional conditions but recoverable
- **INFO:** Significant events (message received, processing complete)
- **DEBUG:** Detailed flow tracking

**Example Log Output:**
```
INFO: Message Received North. MessageID=abc-123, MerchantID=MERC-001, Offset=12345
DEBUG: Message Received North. Value: {...full JSON...}
INFO: Inside North Merchant Scheduler processMerchantBoarding method
INFO: North Merchant Scheduler started : 1712410200000
INFO: Add Messages merchantIds: [MERC-001, MERC-002]
INFO: Update Messages merchantIds: [MERC-003]
INFO: North Merchant Scheduler ended : 1712410210000
```

### MDC (Mapped Diagnostic Context)

**Correlation ID Tracking:**
```java
MDCContext.runWithCorrelation(() -> {
  String correlationId = MDC.get("correlationId");
  log.info("Processing with correlation={}", correlationId);
  
  // All log statements in this context include correlationId
  // Enables end-to-end tracing across systems
});
```

### Monitoring Points

**Key Metrics to Monitor:**

| Metric | Alert Threshold | Frequency |
|--------|-----------------|-----------|
| Messages in PENDING status | > 1000 | Every 5 min |
| FAILED message count | > 10 per hour | Every 5 min |
| Scheduler execution time | > 30 seconds | Every run |
| NOTIFICATIONDATE lag | > 5 seconds | Every 5 min |
| Kafka consumer lag | > 300 messages | Every minute |
| Database connection pool | > 15/20 active | Continuous |

### Audit Trail

**Message Tracking Columns:**
```
MESSAGEID       - UUID for end-to-end tracing
CREATEDDATE     - When listener received message
STARTTIME       - When scheduler picked it up
ENDTIME         - When processing completed
STATUSFLAG      - Final status (Success/Failed)
SERVERNAME      - Which server processed it
MSG_OFFSET      - Kafka offset for re-consumption
```

**Audit Queries:**
```sql
-- Messages stuck in processing > 10 minutes
SELECT * FROM STAGE_UMM_DATA 
WHERE STATUSFLAG = 'P' AND CREATEDDATE < SYSDATE - 10/1440;

-- Failed messages
SELECT MERCHANT_ID, COUNT(*) FROM STAGE_UMM_DATA 
WHERE STATUSFLAG = 'F' GROUP BY MERCHANT_ID;

-- Processing latency
SELECT AVG(ENDTIME - STARTTIME) * 86400 as avg_seconds
FROM STAGE_UMM_DATA WHERE STATUSFLAG = 'S';
```

---

## Flow Diagrams

### Message Ingestion Flow

```
┌─────────────────────────────────────┐
│  UMM System (Merchant Service)      │
│  Updates merchant details           │
└──────────────┬──────────────────────┘
               │
               │ Produces Kafka Event
               │ {
               │   messageId: UUID,
               │   action: "ADD/UPDATE/DELETE",
               │   merchantId: "MERC-001",
               │   beforeData: {...},
               │   afterData: {...}
               │ }
               │
               ▼
        ┌─────────────────────────────────┐
        │ Kafka Topic (North)             │
        │ fiserv-umm-north-merchant...    │
        └──────────────┬──────────────────┘
                       │
                       │ Message queued
                       │ (Offset #12345)
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ UmmKafkaListenerNorth            │
        │                                  │
        │ @KafkaListener triggered         │
        │ - Receive ConsumerRecord         │
        │ - Extract JSON value             │
        │ - Check if processing enabled    │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ NotificationConverter            │
        │                                  │
        │ - Deserialize JSON               │
        │ - Create UmmNotification object  │
        │ - Extract beforeData/afterData   │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ UmmNotificationService           │
        │                                  │
        │ 1. Create StageUmmData entity    │
        │ 2. Populate fields:              │
        │    - MESSAGEID = UUID            │
        │    - MERCHANTID = from message   │
        │    - NOTIFICATIONDATE = msg date │
        │    - CREATEDDATE = NOW()         │
        │    - BEFOREDATA = before JSON    │
        │    - AFTERDATA = after JSON      │
        │    - STATUSFLAG = 'P' (Pending) │
        │    - MSG_OFFSET = 12345         │
        │ 3. Save to database              │
        │ 4. Return (async processing)     │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │ Oracle Database                  │
        │ CTMS.STAGE_UMM_DATA              │
        │                                  │
        │ New row inserted with PENDING    │
        │ status, waiting for scheduler    │
        └──────────────────────────────────┘
```

### Scheduler Processing Flow

```
┌──────────────────────────────┐
│ Scheduler Timer Fires        │
│ (Every 1 minute)             │
└──────────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ NorthMerchantBoardingScheduler
    │ processMerchantBoarding()    │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Initialize MDC correlation   │
    │ Get server name              │
    │ Set remaining limit = 100    │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Fetch ADD Messages           │
    │                              │
    │ SELECT * FROM STAGE_UMM_DATA │
    │ WHERE STATUSFLAG = 'P'       │
    │   AND ACTION = 'ADD'         │
    │   AND STARTTIME IS NULL      │
    │ FOR UPDATE NOWAIT            │
    │ LIMIT 100                    │
    │                              │
    │ UPDATE STARTTIME = NOW(),    │
    │   SERVERNAME = hostname      │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Lock acquired?               │
    │    ├─ NO: Skip this batch    │
    │    └─ YES: Continue          │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Fetch UPDATE Messages        │
    │ (Same process, remaining     │
    │ limit -= records fetched)    │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Fetch DELETE/OTHER Messages  │
    │ (Exclude merchants already   │
    │ fetched in ADD/UPDATE)       │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │ Process Skip Messages                │
    │ (Previously failed, retry < 5 times) │
    │ (Merge into ADD/UPDATE/OTHER lists)  │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ For Each Message Category:   │
    │ - ADD (X records)            │
    │ - UPDATE (Y records)         │
    │ - OTHER (Z records)          │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ MerchantBatchProcessor       │
    │ .processBatch(...)           │
    │                              │
    │ For each record:             │
    │ 1. Extract merchant data     │
    │ 2. Deserialize JSON          │
    │ 3. Validate merchant         │
    │ 4. Call MerchantActionService│
    │ 5. Catch & log errors        │
    │ 6. Continue with next        │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ MerchantActionService        │
    │ .performAction(...)          │
    │                              │
    │ ├─ ADD: INSERT into fact     │
    │ │   tables                   │
    │ ├─ UPDATE: UPDATE fact       │
    │ │   tables                   │
    │ └─ DELETE: mark as deleted   │
    │                              │
    │ Updates: CLIENT_UMM,         │
    │ ENTITLEMENTS, PARTY_HIER...  │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Update Processing Status     │
    │                              │
    │ UPDATE STAGE_UMM_DATA        │
    │ SET ENDTIME = NOW(),         │
    │     STATUSFLAG = 'S' (or 'F')│
    │ WHERE UNIQUEID = xxx         │
    │                              │
    │ S = Success (no exceptions)  │
    │ F = Failed (exception caught)│
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Commit Transaction           │
    │                              │
    │ All updates finalized        │
    │ Message marked complete      │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ Log Summary                  │
    │                              │
    │ INFO: Processed 97 messages  │
    │ - Success: 95                │
    │ - Failed: 2                  │
    │ - Processing time: 8 seconds │
    │                              │
    │ Scheduler ended              │
    └──────────────────────────────┘
```

### Error Handling Flow

```
┌─────────────────────────────────────┐
│ Processing Error Occurs             │
│ (Exception thrown in service)       │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────────────────────┐
        │ Exception Caught             │
        │                              │
        │ try {                        │
        │   process(message)           │
        │ } catch (Exception e) {      │
        │   ...                        │
        │ }                            │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Log Error Details            │
        │ - Message ID                 │
        │ - Merchant ID                │
        │ - Exception stack trace      │
        │ - Error message              │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Determine Error Type         │
        │                              │
        │ ├─ Validation error          │
        │ │  → Mark FAILED, move on    │
        │ │                            │
        │ ├─ Database error            │
        │ │  → Mark FAILED, rollback   │
        │ │  → Next scheduler run      │
        │ │    will retry              │
        │ │                            │
        │ ├─ Kafka listener exception  │
        │ │  → Re-throw UMMServiceEx   │
        │ │  → Message to DLQ          │
        │ │                            │
        │ └─ Other fatal error         │
        │    → Mark FAILED             │
        │    → Alert ops               │
        └──────────────┬───────────────┘
                       │
                       ├─ DLQ Path
                       │  │
                       │  ▼
                       │ ┌──────────────────────────────┐
                       │ │ Dead Letter Topic            │
                       │ │ - Message moved to DLQ       │
                       │ │ - Manually investigated      │
                       │ │ - Fix issue                  │
                       │ │ - Resubmit message           │
                       │ └──────────────────────────────┘
                       │
                       └─ Retry Path
                          │
                          ▼
                       ┌──────────────────────────────┐
                       │ Mark as FAILED in STAGE_UMM │
                       │ STATUSFLAG = 'F'             │
                       │ Error message stored         │
                       │                              │
                       │ Next scheduler run:          │
                       │ - Detect FAILED message      │
                       │ - Include in skip list       │
                       │ - Retry up to 5 times        │
                       │ - If still fails: manual     │
                       │   investigation needed       │
                       └──────────────────────────────┘
```

---

## Deployment Checklist

- [ ] Java 17 installed on Tomcat server
- [ ] Tomcat application server configured and running
- [ ] Oracle JDBC driver (ojdbc8-21.5.0.0) in Tomcat lib
- [ ] Oracle database connectivity verified
- [ ] Kafka clusters (North & Omaha) accessible from Tomcat server
- [ ] Kafka topic permissions verified
- [ ] SASL/SCRAM credentials configured correctly
- [ ] Environment-specific properties file created
- [ ] All property values verified for environment
- [ ] Scheduler cron expression appropriate for environment
- [ ] Database tables created (STAGE_UMM_DATA, etc.)
- [ ] Connection pool settings tuned for environment
- [ ] Logging configured and directory created
- [ ] Application built successfully (`mvn clean package`)
- [ ] WAR file size reasonable (< 500MB)
- [ ] WAR deployed to Tomcat webapps directory
- [ ] Properties file copied to Tomcat config directory
- [ ] Tomcat restarted
- [ ] Application logs checked for startup errors
- [ ] Health check endpoints responding
- [ ] Kafka listener active (logs show messages being consumed)
- [ ] Scheduler running (logs show scheduler execution)
- [ ] Test message produced to verify end-to-end flow
- [ ] Monitoring alerts configured
- [ ] Documentation updated for environment

---

*Document Version: 1.0*  
*Last Updated: April 6, 2026*  
*Status: Complete Architecture Document - FDPOS Services*



========

DOC 4

fiserv_resume_section.md


# FISERV - PROFESSIONAL EXPERIENCE

**Senior Full-Stack Software Engineer** | Fiserv Global Business Services (GBS) | April 2024 – Present

## Overview
Architected and launched three enterprise-grade applications from ground zero, establishing comprehensive infrastructure for payment device management and merchant data processing across Fiserv's ecosystem. Led full-stack development spanning event-driven backend systems, microservices architecture, and React-based administrative interfaces, serving thousands of payment terminals and merchants in production environments.

---

## Key Achievements & Projects

### 1. **Event-Driven Kafka Architecture (FDPOS Services)**
**Core Technologies:** Spring Framework 6.2.17 | Apache Kafka MSK | Oracle | Java 17

**Architectural Responsibilities:**
- **Designed & implemented dual-region Kafka consumer infrastructure** from scratch for FDPOS Services, consuming merchant lifecycle events from two independent AWS MSK clusters (North & Omaha regions with SASL/SCRAM authentication)
- **Built robust message staging pipeline** that processes 100+ merchant events per minute through Oracle database queue system with sophisticated distributed locking mechanism (FOR UPDATE NOWAIT pattern) to prevent race conditions across multiple Tomcat server instances
- **Engineered scheduled batch processor** running every 60 seconds with dynamic cron expression configuration, enabling real-time property changes without application restart
- **Implemented comprehensive message correlation & audit trail system** tracking end-to-end flow from Kafka ingestion (offset-based tracking) through processing completion with business-relevant correlation IDs for debugging production issues

**Technical Highlights:**
- Handled authentication complexity: Configured SASL/SCRAM-SHA-512 security protocol with credential rotation support
- Solved concurrency challenges: Implemented database-level distributed locking preventing duplicate message processing in high-availability Tomcat cluster environment
- Designed for resilience: Separate processing pipelines per region enable regional failure isolation; messages stuck in processing automatically detected via timestamp tracking
- Optimized throughput: Tuned batch window sizes and connection pooling (HikariCP) to process thousands of merchant events daily with <70 second end-to-end SLA

---

### 2. **Microservices & Secure Credential Management (EstateWS)**
**Core Technologies:** Spring Boot 4.0.1 | PostgreSQL Aurora RDS | Java 21 | RSA Encryption | Apigee Integration

**Full-Stack Development & Security Architecture:**
- **Initiated EstateWS microservice architecture** enabling secure provisioning of API credentials to payment terminals and vendors at enterprise scale
- **Integrated with Apigee API Gateway** through custom HMAC-SHA256 signed request implementation (X-Timestamp, X-Client-Request-ID headers) ensuring secure credential generation
- **Architected vendor-specific RSA encryption strategy** supporting multiple device manufacturers (Ingenico, BBPOS, etc.) with vendor-specific padding algorithms and PEM/Base64 key format handling
- **Designed comprehensive audit logging system** capturing all credential lifecycle events (generation, refresh, reset, deletion) with user attribution and request/response tracking for compliance

**Technical Achievements:**
- Built secure credential download mechanism with encrypted key delivery and download tracking
- Engineered client & vendor API key management supporting multi-tenant architecture
- Designed RESTful endpoints following industry best practices with standardized error handling and response wrappers
- Implemented optimistic locking strategy for concurrent credential operations preventing conflicts

---

### 3. **Full-Stack React + Spring Boot Application (EstateUI)**
**Frontend:** React 19.0.0 | TypeScript 5.7 | Material-UI 7.3.7 | Vite | React Router  
**Backend:** Spring Boot 4.0.1 | BFF Pattern | API Proxy Layer

**Full-Stack Development Responsibilities:**
- **Architected hybrid React + Spring Boot application** from the ground up, establishing modern UI architecture with TypeScript for type safety and Material-UI components for enterprise-grade UI consistency
- **Implemented Backend-for-Frontend (BFF) pattern** creating proxy layer to EstateWS microservice, abstracting backend complexity and enabling independent frontend deployment cycles
- **Designed comprehensive administrative dashboard** featuring device onboarding, credential management, bulk operations, and vendor/client registration workflows with client-side validation and error handling
- **Built state management infrastructure** using React Context API with Hooks, establishing foundation for future Redux migration as application scales

**Frontend Highlights:**
- Component-based architecture enabling code reuse across terminal management, master key management, and bulk operations modules
- Form handling with validation and intelligent error feedback for complex device provisioning workflows
- Responsive Material-UI layouts supporting diverse administrative workflows
- Client-side logging integration for debugging production issues

**Backend API Layer:**
- RESTful proxy controller pattern abstracting EstateWS endpoints and handling CORS concerns
- Unified response wrapper (GenericResponse<T>) standardizing API responses across application
- Service layer orchestrating multi-step operations and error recovery
- In-memory vendor key service managing encryption configurations

---

## Technical Expertise Demonstrated

### Distributed Systems & Event-Driven Architecture
- ✅ **Kafka Consumer Design** - Multi-region, SASL/SCRAM secured, offset-based tracking, consumer group management
- ✅ **Event Processing Pipelines** - Message staging, batching, error handling, dead letter queues
- ✅ **Distributed Locking** - Database-level pessimistic locking preventing race conditions in multi-instance setup
- ✅ **Asynchronous Processing** - Decoupled message ingestion from processing via staging pipeline

### Backend Architecture & Design Patterns
- ✅ **Microservices Architecture** - Independent service deployment, API contracts, inter-service communication
- ✅ **Backend-for-Frontend (BFF)** - Proxy pattern for frontend/backend separation of concerns
- ✅ **Repository Pattern** - Spring Data JPA abstractions with custom queries
- ✅ **Service Layer Design** - Business logic encapsulation, transaction management, cross-cutting concerns

### Security & Encryption
- ✅ **RSA Key Encryption** - Vendor-specific cipher configuration, PEM/Base64 key handling
- ✅ **HMAC Request Signing** - Authentication header generation with timestamp and replay attack prevention
- ✅ **SASL/SCRAM Authentication** - Kafka cluster credential management and rotation
- ✅ **Audit & Compliance** - Comprehensive operation logging with user attribution and regulatory support

### Frontend Engineering (React/TypeScript)
- ✅ **React Component Architecture** - Reusable, testable components with TypeScript type safety
- ✅ **Client-Side Routing** - React Router navigation across multi-module administrative workflows
- ✅ **Form Handling & Validation** - Complex form workflows with real-time validation and error states
- ✅ **Material-UI Mastery** - Enterprise component library for admin dashboards and complex UIs
- ✅ **Modern Build Tools** - Vite configuration and optimization for fast development iterates

### Database & Data Persistence
- ✅ **Oracle Database Design** - CLOB handling for large JSON payloads, indexing strategy, query optimization
- ✅ **PostgreSQL/Aurora RDS** - Cloud-native relational database design for microservices
- ✅ **Hibernate/JPA** - Entity relationships, lazy loading strategies, query optimization
- ✅ **Connection Pooling** - HikariCP tuning for high-concurrency environments

### DevOps & Infrastructure
- ✅ **Multi-Environment Configuration** - Property-driven setup for dev/qa/prod with secure credential management
- ✅ **Application Deployment** - WAR deployment on Tomcat clusters, Spring Boot JAR packaging, CI/CD readiness
- ✅ **Monitoring & Observability** - Correlation IDs, MDC logging, audit trail systems, operational metrics
- ✅ **AWS MSK & Aurora RDS** - Cloud-managed Kafka brokers and relational database services

### Modern Technology Stack
- **Backend:** Spring Framework 6.2, Spring Boot 4.0, Java 17/21, Hibernate 6.4, Maven
- **Frontend:** React 19, TypeScript 5.7, Material-UI 7.3, React Router 7.3, Vite 6.2
- **Messaging:** Apache Kafka, AWS MSK
- **Data:** Oracle, PostgreSQL Aurora, HikariCP
- **Security:** RSA Encryption, HMAC-SHA256, SASL/SCRAM

---

## Impact & Scale

| Metric | Achievement |
|--------|-------------|
| **Messages Processed** | 100+ merchant events/minute through FDPOS Services |
| **End-to-End SLA** | <70 seconds from Kafka ingestion to fact table update |
| **Active Devices** | Provisioning credentials for thousands of payment terminals |
| **High Availability** | Multi-instance Tomcat clusters with distributed locking preventing race conditions |
| **Geographic Coverage** | Two independent regional data centers (North & Omaha) with regional failure isolation |
| **Code Quality** | Enterprise-grade error handling, comprehensive audit logging, production-ready deployment |

---

## Initiative & Project Initiation

- **Launched three projects from ground zero**, establishing complete architecture, technology choices, project structure, and deployment pipelines
- **Mentored team on event-driven design patterns** during FDPOS Services Kafka listener development
- **Established conventions** for multi-environment property management, enabling seamless deployment across dev/qa/prod environments
- **Created comprehensive architecture documentation** enabling rapid onboarding of future team members

---

## Why This Experience Stands Out in Today's Job Market

1. **Event-Driven Architecture Expertise** - Kafka and asynchronous processing are hot skills for enterprise systems; dual-region setup shows advanced thinking
2. **Full-Stack Mastery** - Rare combination of strong backend (Spring Framework/Boot, microservices) and modern frontend (React 19, TypeScript) capabilities
3. **Security-Conscious Design** - Encryption, authentication, audit trails demonstrate understanding of enterprise security requirements
4. **Distributed Systems Experience** - Multi-region Kafka, distributed locking, and high-availability patterns prepare for scale challenges
5. **Enterprise Production Experience** - Building systems that actually run in production at scale with monitoring, logging, and operational concerns
6. **Modern Tech Stack** - Java 21, Spring Boot 4.0, React 19, TypeScript - not legacy tech; competitive with current job market demands
7. **Cloud-Native Mindset** - AWS MSK, Aurora RDS, microservices architecture shows familiarity with modern cloud deployment patterns
8. **Project Ownership** - Initiative in launching projects demonstrates leadership and independent problem-solving ability

---

## Professional Summary

A results-driven full-stack engineer who architected mission-critical payment systems processing thousands of events daily. Proven expertise in event-driven architecture, microservices design, and distributed systems. Comfortable across the entire technology stack from React frontends to Spring Framework backends to Apache Kafka infrastructure. Demonstrated ability to build secure, scalable systems from conception through production deployment, with particular strength in Kafka consumer architecture, distributed systems patterns, and enterprise-grade security implementation.



========

DOC 5

========

DOC 6

