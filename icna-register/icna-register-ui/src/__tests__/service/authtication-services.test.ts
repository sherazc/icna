import {defaultAuthUserTokenDto} from "../../service/service-types";
import {isValidAuthUserToken} from "../../service/authentication-services";

describe('authentication-service', () => {
    test("isValidAuthUserToken", () => {
        const testToken = defaultAuthUserTokenDto();
        expect(isValidAuthUserToken(testToken)).toBeFalsy();

    })
});