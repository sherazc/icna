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
        expect(isContainsAllRoles(testToken, ['ADMIN'])).toBeFalsy();
        testToken.roles = ['ADMIN']
        expect(isContainsAllRoles(testToken, ['ADMIN'])).toBeTruthy();

        testToken.roles.push('ASSISTANT');
        expect(isContainsAllRoles(testToken, ['ADMIN'])).toBeTruthy();
        expect(isContainsAllRoles(testToken, ['ADMIN', 'ASSISTANT'])).toBeTruthy();
        expect(isContainsAllRoles(testToken, ['ADMIN', 'ASSISTANT', 'BASIC_USER'])).toBeFalsy();
    });

    test("isContainsAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isContainsAnyRoles(testToken, [])).toBeTruthy();
        expect(isContainsAnyRoles(testToken, ['ADMIN'])).toBeFalsy();

        testToken.roles = ['ADMIN']
        expect(isContainsAnyRoles(testToken, ['ADMIN'])).toBeTruthy();
        testToken.roles = ['ASSISTANT']
        expect(isContainsAnyRoles(testToken, ['ADMIN', 'ASSISTANT'])).toBeTruthy();
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
        expect(isAuthenticate(true, testToken, ['ADMIN'])).toBeFalsy();
        expect(isAuthenticate(true, testToken, ['ADMIN', 'ASSISTANT'], [])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push('ADMIN')
        expect(isAuthenticate(true, testToken, ['ADMIN'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, ['ADMIN', 'ASSISTANT'])).toBeFalsy();

        testToken.roles.push('ASSISTANT')
        expect(isAuthenticate(true, testToken, ['ADMIN'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, ['ADMIN', 'ASSISTANT'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, ['ADMIN', 'BASIC_USER'])).toBeFalsy();
    });

    test("isAuthenticate shouldHaveAnyRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isAuthenticate(true, testToken, [], ['ADMIN'])).toBeFalsy();
        expect(isAuthenticate(true, testToken, [], ['ADMIN', 'ASSISTANT'])).toBeFalsy();

        testToken.token = "abc"
        testToken.roles.push('ADMIN')
        expect(isAuthenticate(true, testToken, [], ['ADMIN'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], ['ADMIN', 'ASSISTANT'])).toBeTruthy();

        testToken.roles.push('ASSISTANT')
        expect(isAuthenticate(true, testToken, [], ['ADMIN'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], ['ADMIN', 'ASSISTANT'])).toBeTruthy();
        expect(isAuthenticate(true, testToken, [], ['ADMIN', 'BASIC_USER'])).toBeTruthy();
    });
});
