import {AuthUserTokenDto} from "./service-types";
import {isNotBlankString} from "./utilities";

export const isValidAuthUserToken = (aut: AuthUserTokenDto | undefined) => isNotBlankString(aut?.token)