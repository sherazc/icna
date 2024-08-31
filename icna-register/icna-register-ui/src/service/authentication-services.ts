import {AuthRole, AuthUserTokenDto} from "./service-types";
import {isNotBlankString} from "./utilities";

export const isValidAuthUserToken = (aut: AuthUserTokenDto | undefined) => isNotBlankString(aut?.token)

export function isContainsAllRoles(authUserToken: AuthUserTokenDto, shouldHaveRoles: AuthRole[]) {
    if (shouldHaveRoles.length < 1) {
        return true;
    }
    const filteredRoles = shouldHaveRoles.filter(role => authUserToken.roles.includes(role));
    return filteredRoles.length === shouldHaveRoles.length;
}

export function isNotContainsAllRoles(authUserToken: AuthUserTokenDto, shouldHaveRoles: AuthRole[]) {
    if (shouldHaveRoles.length < 1) {
        return true;
    }
    const filteredRoles = shouldHaveRoles.filter(role => authUserToken.roles.includes(role));
    return filteredRoles.length < 1;
}
