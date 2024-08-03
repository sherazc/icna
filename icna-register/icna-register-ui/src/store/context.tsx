import React, {createContext, useReducer} from "react";
import {LoadingAction, loadingMessagesReducer} from "./loadingMessageReducer";
import {AuthUserAction, authUserReducer} from "./authUserReducer";

export type Action = {
    type: string;
}

export type LoadingMessage = {
    id: number;
    message: string;
}

export type AuthUser = {
    userName: string;
    authToken: string;
    roles: string[];
}

type RootStateType = {
    /**
     * Empty array means do not show loading.
     * showLoading() function will dispatch
     */
    loadingMessages: LoadingMessage[];
    authUser: AuthUser;
}

const initialAppState: RootStateType = {
    loadingMessages: [],
    authUser: {userName: "", authToken: "", roles: []}
}

const AppContext = createContext<[
    state: RootStateType,
    dispatch: React.Dispatch<RootAction>
]>([
    initialAppState,
    () => null
]);

type RootAction = LoadingAction | AuthUserAction;


const mainReducer = ({loadingMessages, authUser}: RootStateType, action: RootAction) => ({
    loadingMessages: loadingMessagesReducer(loadingMessages, action as LoadingAction),
    authUser: authUserReducer(authUser, action as AuthUserAction)
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
