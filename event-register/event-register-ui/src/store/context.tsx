import React, {createContext, useReducer} from "react";
import {LoadingAction, loadingMessagesReducer} from "./loadingMessageReducer";
import {AuthUserAction, authUserReducer} from "./authUserReducer";
import {AuthUserTokenDto, defaultAuthUserTokenDto, RegisterApisType} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import {RegisterApisAction, registerApisReducer} from "./registerApisReducer";

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
    regApis: RegisterApisType;
}

const initialAppState: RootStateType = {
    loadingMessages: [],
    authUserToken: defaultAuthUserTokenDto(),
    regApis: registerApis()
}

const AppContext = createContext<[
    state: RootStateType,
    dispatch: React.Dispatch<RootAction>
]>([
    initialAppState,
    () => null
]);

type RootAction = LoadingAction | AuthUserAction | RegisterApisAction;

// Combines all the reducers
const mainReducer = ({loadingMessages, authUserToken, regApis}: RootStateType, action: RootAction) => ({
    loadingMessages: loadingMessagesReducer(loadingMessages, action as LoadingAction),
    authUserToken: authUserReducer(authUserToken, action as AuthUserAction),
    regApis: registerApisReducer(regApis, action as RegisterApisAction)
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
