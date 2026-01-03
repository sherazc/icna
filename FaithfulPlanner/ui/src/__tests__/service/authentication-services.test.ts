import {defaultAuthUserTokenDto} from "../../service/service-types";
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
        expect(isAuthenticate(true, testToken, ['MASTER'])).toBeFalsy();
        expect(isAuthenticate(true, testToken, ['MASTER', 'ADMIN'], [])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push('MASTER')
        expect(isAuthenticate(true, testToken, ['MASTER'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, ['MASTER', 'ADMIN'])).toBeFalsy();

        testToken.roles.push('ADMIN')
        expect(isAuthenticate(true, testToken, ['MASTER'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, ['MASTER', 'ADMIN'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, ['MASTER', 'BASIC_USER'])).toBeFalsy();
    });

    test("isAuthenticate shouldHaveAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticate(true, testToken, [], ['MASTER'])).toBeFalsy();
        expect(isAuthenticate(true, testToken, [], ['MASTER', 'ADMIN'])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push('MASTER')
        expect(isAuthenticate(true, testToken, [], ['MASTER'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], ['MASTER', 'ADMIN'])).toBeTruthy();

        testToken.roles.push('ADMIN')
        expect(isAuthenticate(true, testToken, [], ['MASTER'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], ['MASTER', 'ADMIN'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], ['MASTER', 'BASIC_USER'])).toBeTruthy();
    });
});
