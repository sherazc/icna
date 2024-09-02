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


export function isContainsAnyRoles(authUserToken: AuthUserTokenDto, shouldHaveAnyRoles: AuthRole[]) {
    if (shouldHaveAnyRoles.length < 1) {
        return true;
    }
    const filteredRoles = shouldHaveAnyRoles.filter(role => authUserToken.roles.includes(role));
    return filteredRoles.length > 0;
}

export const isAuthenticate = (
    authenticated = true, // content requires authentication.
    authUserToken: AuthUserTokenDto,
    shouldHaveRoles:AuthRole[] = [],
    shouldHaveAnyRoles:AuthRole[] = []): boolean => {

    const validAuthUserToken = isValidAuthUserToken(authUserToken);
    const checkShouldHaveRoles = shouldHaveRoles.length > 0;
    const checkShouldHaveAnyRoles = shouldHaveAnyRoles.length > 0;
    const containsAllRoles = isContainsAllRoles(authUserToken, shouldHaveRoles);
    const containsAnyRoles = isContainsAnyRoles(authUserToken, shouldHaveAnyRoles);

    if (!authenticated && !validAuthUserToken) return true;
    if (!authenticated && validAuthUserToken) return false;

    if (authenticated && validAuthUserToken && !checkShouldHaveAnyRoles && !checkShouldHaveRoles) return true;
    if (authenticated && validAuthUserToken && checkShouldHaveAnyRoles && containsAnyRoles) return true;
    return authenticated && validAuthUserToken && checkShouldHaveRoles && containsAllRoles;
}

