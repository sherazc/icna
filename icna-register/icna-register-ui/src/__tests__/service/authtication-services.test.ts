import {AuthRole, defaultAuthUserTokenDto} from "../../service/service-types";
import {isContainsAllRoles, isContainsAnyRoles, isValidAuthUserToken} from "../../service/authentication-services";

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
});