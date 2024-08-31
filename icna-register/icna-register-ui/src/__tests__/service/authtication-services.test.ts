import {AuthRole, defaultAuthUserTokenDto} from "../../service/service-types";
import {isContainsAllRoles, isNotContainsAllRoles, isValidAuthUserToken} from "../../service/authentication-services";

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

    test("isNotContainsAllRoles", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isNotContainsAllRoles(testToken, [])).toBeTruthy();
        expect(isNotContainsAllRoles(testToken, [AuthRole.ADMIN])).toBeTruthy();

        testToken.roles = [AuthRole.ADMIN]
        expect(isNotContainsAllRoles(testToken, [AuthRole.ADMIN])).toBeFalsy();
        expect(isNotContainsAllRoles(testToken, [AuthRole.BASIC_USER])).toBeTruthy();
        expect(isNotContainsAllRoles(testToken, [AuthRole.BASIC_USER, AuthRole.ASSISTANT])).toBeTruthy();

        testToken.roles.push(AuthRole.ASSISTANT);
        expect(isNotContainsAllRoles(testToken, [AuthRole.BASIC_USER])).toBeTruthy();
        expect(isNotContainsAllRoles(testToken, [AuthRole.ADMIN, AuthRole.BASIC_USER])).toBeFalsy();

    });
});