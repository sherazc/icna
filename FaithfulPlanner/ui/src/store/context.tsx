import React, {createContext, useReducer} from "react";
import {type LoadingAction, loadingMessagesReducer} from "./loadingMessageReducer";
import {type AuthUserAction, authUserReducer} from "./authUserReducer";
import {
    type AuthUserTokenDto,
    type ClinicApisType,
    type Company,
    type EmployeeGroupDto
} from "../service/service-types";
import { clinicApis, createAuthHeader } from "../service/api/ApiClinic";
import { clinicApisReducer, type ClinicApisAction } from "./clinicApisReducer";
import { companyReducer, type CompanyAction } from "./companyReducer";
import { employeeGroupReducer, type EmployeeGroupAction } from "./employeeGroupsReducer";
import { loadAuthUserToken } from "../service/token-storage";
import { isValidAuthUserToken } from "../service/authentication-services";

export type Action = {
    type: string;
}

export type LoadingMessage = {
    id: number;
    message: string;
}

type RootStateType = {
    /**
     * Empty array means do not show loading.
     * showLoading() function will dispatch
     */
    loadingMessages: LoadingMessage[];
    authUserToken: AuthUserTokenDto;
    clinicApis: ClinicApisType;
    companies: Company[];
    employeeGroups: EmployeeGroupDto[]
}


const persistedAuthUserToken = loadAuthUserToken();

const initialAppState: RootStateType = {
    loadingMessages: [],
    authUserToken: persistedAuthUserToken,
    clinicApis: isValidAuthUserToken(persistedAuthUserToken)
        ? clinicApis(createAuthHeader(persistedAuthUserToken))
        : clinicApis(),
    companies: [],
    employeeGroups: []
}

const AppContext = createContext<[
    state: RootStateType,
    dispatch: React.Dispatch<RootAction>
]>([
    initialAppState,
    () => null
]);

type RootAction = LoadingAction | AuthUserAction | ClinicApisAction | CompanyAction | EmployeeGroupAction;

// Combines all the reducers
const mainReducer = ({loadingMessages, authUserToken, clinicApis, companies, employeeGroups}: RootStateType, action: RootAction) => ({
    loadingMessages: loadingMessagesReducer(loadingMessages, action as LoadingAction),
    authUserToken: authUserReducer(authUserToken, action as AuthUserAction),
    clinicApis: clinicApisReducer(clinicApis, action as ClinicApisAction),
    companies: companyReducer(companies, action as CompanyAction),
    employeeGroups: employeeGroupReducer(employeeGroups, action as EmployeeGroupAction),

});

interface Props {
    children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({children}: Props) => {
    const [state, dispatch] = useReducer(mainReducer, initialAppState);

    return (
        <AppContext.Provider value={[state, dispatch]}>
            {children}
        </AppContext.Provider>
    )
}

export {AppContext, AppProvider};
