import {LoadingMessage} from "./context";

export enum ActionNameLoading {
    loadingShow = 'LOADING_MESSAGE_SHOW',
    loadingHide = 'LOADING_MESSAGE_HIDE'
}

export type LoadingAction = {
    type: ActionNameLoading;
    payload: LoadingMessage;
}


export const loadingMessagesReducer = (loadingMessagesState: LoadingMessage[], action: LoadingAction): LoadingMessage[] => {
    switch (action.type) {
        case ActionNameLoading.loadingShow :
            return [
                ...loadingMessagesState,
                {
                    id: action.payload.id,
                    message: action.payload.message
                }
            ]
        case ActionNameLoading.loadingHide :
            return [...loadingMessagesState.filter(ls => ls.id !== action.payload.id)]
        default:
            return loadingMessagesState;
    }
}
