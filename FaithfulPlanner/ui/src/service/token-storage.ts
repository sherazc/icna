import { defaultAuthUserTokenDto, type AuthUserTokenDto } from "./service-types";

const STORAGE_KEY = "authUserToken";

export const saveAuthUserToken = (authUserToken: AuthUserTokenDto): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUserToken));
};

export const loadAuthUserToken = (): AuthUserTokenDto => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultAuthUserTokenDto();
    try {
        return JSON.parse(stored) as AuthUserTokenDto;
    } catch {
        return defaultAuthUserTokenDto();
    }
};

export const clearAuthUserToken = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
