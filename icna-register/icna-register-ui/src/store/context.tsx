import React, {createContext, useReducer} from "react";
import {LoadingAction, loadingMessagesReducer} from "./loadingMessageReducer";
import {AuthUserAction, authUserReducer} from "./authUserReducer";
import {AuthUserTokenDto, defaultAuthUserTokenDto} from "../service/service-types";

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
}

const initialAppState: RootStateType = {
    loadingMessages: [],
    authUserToken: defaultAuthUserTokenDto()
}

const AppContext = createContext<[
    state: RootStateType,
    dispatch: React.Dispatch<RootAction>
]>([
    initialAppState,
    () => null
]);

type RootAction = LoadingAction | AuthUserAction;


const mainReducer = ({loadingMessages, authUserToken}: RootStateType, action: RootAction) => ({
    loadingMessages: loadingMessagesReducer(loadingMessages, action as LoadingAction),
    authUserToken: authUserReducer(authUserToken, action as AuthUserAction)
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
