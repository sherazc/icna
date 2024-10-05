import {AuthRole, defaultAuthUserTokenDto} from "../../service/service-types";
import {
    isAuthenticate,
    isContainsAllRoles,
    isContainsAnyRoles,
    isValidAuthUserToken
} from "../../service/authentication-services";

describe('authentication-service', () => {
    test("isValidAuthUserToken", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isValidAuthUserToken(testToken)).toBeFalsy();

        testToken.token = "";
        expect(isValidAuthUserToken(testToken)).toBeFalsy();

        testToken.token = "abc";
        expect(isValidAuthUserToken(testToken)).toBeTruthy();
    });

    test("isContainsAllRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isContainsAllRoles(testToken, [])).toBeTruthy();
        expect(isContainsAllRoles(testToken, [AuthRole.ADMIN])).toBeFalsy();
        testToken.roles = [AuthRole.ADMIN]
        expect(isContainsAllRoles(testToken, [AuthRole.ADMIN])).toBeTruthy();

        testToken.roles.push(AuthRole.ASSISTANT);
        expect(isContainsAllRoles(testToken, [AuthRole.ADMIN])).toBeTruthy();
        expect(isContainsAllRoles(testToken, [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeTruthy();
        expect(isContainsAllRoles(testToken, [AuthRole.ADMIN, AuthRole.ASSISTANT, AuthRole.BASIC_USER])).toBeFalsy();
    });

    test("isContainsAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isContainsAnyRoles(testToken, [])).toBeTruthy();
        expect(isContainsAnyRoles(testToken, [AuthRole.ADMIN])).toBeFalsy();

        testToken.roles = [AuthRole.ADMIN]
        expect(isContainsAnyRoles(testToken, [AuthRole.ADMIN])).toBeTruthy();
        testToken.roles = [AuthRole.ASSISTANT]
        expect(isContainsAnyRoles(testToken, [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeTruthy();
    });

    test("isAuthenticate unauthenticated", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticate(false, testToken)).toBeTruthy();
        expect(isAuthenticate(false, testToken, [])).toBeTruthy();
        expect(isAuthenticate(false, testToken, [], [])).toBeTruthy();
        testToken.token = "abc"
        expect(isAuthenticate(false, testToken)).toBeFalsy();
        expect(isAuthenticate(false, testToken, [])).toBeFalsy();
        expect(isAuthenticate(false, testToken, [], [])).toBeFalsy();
    });

    test("isAuthenticate authenticated", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticate(true, testToken)).toBeFalsy();
        expect(isAuthenticate(true, testToken, [])).toBeFalsy();
        expect(isAuthenticate(true, testToken, [], [])).toBeFalsy();

        testToken.token = "abc"
        expect(isAuthenticate(true, testToken)).toBeTruthy();
        expect(isAuthenticate(true, testToken, [])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], [])).toBeTruthy();
    });

    test("isAuthenticate shouldHaveRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN])).toBeFalsy();
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN, AuthRole.ASSISTANT], [])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push(AuthRole.ADMIN)
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeFalsy();

        testToken.roles.push(AuthRole.ASSISTANT)
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [AuthRole.ADMIN, AuthRole.BASIC_USER])).toBeFalsy();
    });

    test("isAuthenticate shouldHaveAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN])).toBeFalsy();
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push(AuthRole.ADMIN)
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeTruthy();

        testToken.roles.push(AuthRole.ASSISTANT)
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN, AuthRole.ASSISTANT])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], [AuthRole.ADMIN, AuthRole.BASIC_USER])).toBeTruthy();
    });
});
