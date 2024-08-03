import {LoadingMessage} from "./context";

export enum ActionNameLoading {
    loadingMessageAdd = 'LOADING_MESSAGE_ADD',
    loadingMessageRemove = 'LOADING_MESSAGE_REMOVE'
}

export type LoadingAction = {
    type: ActionNameLoading;
    payload: LoadingMessage;
}


export const loadingMessagesReducer = (loadingMessagesState: LoadingMessage[], action: LoadingAction): LoadingMessage[] => {
    switch (action.type) {
        case ActionNameLoading.loadingMessageAdd :
            return [
                ...loadingMessagesState,
                {
                    id: action.payload.id,
                    message: action.payload.message
                }
            ]
        case ActionNameLoading.loadingMessageRemove :
            return [...loadingMessagesState.filter(ls => ls.id !== action.payload.id)]
        default:
            return loadingMessagesState;
    }
}
