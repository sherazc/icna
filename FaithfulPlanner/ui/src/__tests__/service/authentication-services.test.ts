import {defaultAuthUserTokenDto} from "../../service/service-types";
import {
    isAuthenticated,
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
        expect(isContainsAllRoles(testToken, ['MASTER'])).toBeFalsy();
        testToken.roles = ['MASTER']
        expect(isContainsAllRoles(testToken, ['MASTER'])).toBeTruthy();

        testToken.roles.push('ADMIN');
        expect(isContainsAllRoles(testToken, ['MASTER'])).toBeTruthy();
        expect(isContainsAllRoles(testToken, ['MASTER', 'ADMIN'])).toBeTruthy();
        expect(isContainsAllRoles(testToken, ['MASTER', 'ADMIN', 'BASIC_USER'])).toBeFalsy();
    });

    test("isContainsAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isContainsAnyRoles(testToken, [])).toBeTruthy();
        expect(isContainsAnyRoles(testToken, ['MASTER'])).toBeFalsy();

        testToken.roles = ['MASTER']
        expect(isContainsAnyRoles(testToken, ['MASTER'])).toBeTruthy();
        testToken.roles = ['ADMIN']
        expect(isContainsAnyRoles(testToken, ['MASTER', 'ADMIN'])).toBeTruthy();
    });

    test("isAuthenticate unauthenticated", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticated(false, testToken)).toBeTruthy();
        expect(isAuthenticated(false, testToken, [])).toBeTruthy();
        expect(isAuthenticated(false, testToken, [], [])).toBeTruthy();
        testToken.token = "abc"
        expect(isAuthenticated(false, testToken)).toBeFalsy();
        expect(isAuthenticated(false, testToken, [])).toBeFalsy();
        expect(isAuthenticated(false, testToken, [], [])).toBeFalsy();
    });

    test("isAuthenticate authenticated", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticated(true, testToken)).toBeFalsy();
        expect(isAuthenticated(true, testToken, [])).toBeFalsy();
        expect(isAuthenticated(true, testToken, [], [])).toBeFalsy();

        testToken.token = "abc"
        expect(isAuthenticated(true, testToken)).toBeTruthy();
        expect(isAuthenticated(true, testToken, [])).toBeTruthy();
        expect(isAuthenticated(true, testToken, [], [])).toBeTruthy();
    });

    test("isAuthenticate shouldHaveRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticated(true, testToken, ['MASTER'])).toBeFalsy();
        expect(isAuthenticated(true, testToken, ['MASTER', 'ADMIN'], [])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push('MASTER')
        expect(isAuthenticated(true, testToken, ['MASTER'])).toBeTruthy();
        expect(isAuthenticated(true, testToken, ['MASTER', 'ADMIN'])).toBeFalsy();

        testToken.roles.push('ADMIN')
        expect(isAuthenticated(true, testToken, ['MASTER'])).toBeTruthy();
        expect(isAuthenticated(true, testToken, ['MASTER', 'ADMIN'])).toBeTruthy();
        expect(isAuthenticated(true, testToken, ['MASTER', 'BASIC_USER'])).toBeFalsy();
    });

    test("isAuthenticate shouldHaveAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticated(true, testToken, [], ['MASTER'])).toBeFalsy();
        expect(isAuthenticated(true, testToken, [], ['MASTER', 'ADMIN'])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push('MASTER')
        expect(isAuthenticated(true, testToken, [], ['MASTER'])).toBeTruthy();
        expect(isAuthenticated(true, testToken, [], ['MASTER', 'ADMIN'])).toBeTruthy();

        testToken.roles.push('ADMIN')
        expect(isAuthenticated(true, testToken, [], ['MASTER'])).toBeTruthy();
        expect(isAuthenticated(true, testToken, [], ['MASTER', 'ADMIN'])).toBeTruthy();
        expect(isAuthenticated(true, testToken, [], ['MASTER', 'BASIC_USER'])).toBeTruthy();
    });
});
