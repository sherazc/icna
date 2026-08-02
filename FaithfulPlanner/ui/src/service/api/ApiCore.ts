import {fetchWrapper} from "./ApiFetchWrapper";

export type ApiMethod = "GET" | "PUT" | "POST" | "DELETE";
export type ApiHeaders = [string, string][];

export type ApiRequest = {
    endpoint: string;
    payload?: any;
    method?: ApiMethod;
    headers?: ApiHeaders;
    /** Opt out of the 401 refresh-and-retry behaviour, eg. for login/refresh calls themselves. */
    skipAuthRetry?: boolean;
    /** Populated by callApi() after each attempt so callApiIntercept() can branch on status without changing the rejected value's shape. */
    lastStatus?: number;
}

export type InterceptorCallBacks = {
    before?: Function;
    afterSuccess?: ((response?: any) => void)[];
    afterError?: ((error?: any) => void)[];
}

const AUTHORIZATION_HEADER = "Authorization";

/**
 * The auth layer registers itself here so this generic HTTP layer never has to
 * import anything about tokens/context/routing. On a 401, callApiIntercept()
 * calls this to get a refreshed Authorization header before retrying once.
 */
type UnauthorizedHandler = () => Promise<ApiHeaders>;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const registerUnauthorizedHandler = (handler: UnauthorizedHandler | null): void => {
    unauthorizedHandler = handler;
}

// ############## API Core service
export const addHeadersInRequest = (request: ApiRequest, headers?: ApiHeaders): ApiRequest => {
    if (headers) {
        if (!request.headers) {
            request.headers = [];
        }
        headers.forEach(h => request.headers?.push(h));
    }
    return request;
}

const setAuthHeader = (request: ApiRequest, authHeaders: ApiHeaders): void => {
    request.headers = (request.headers ?? []).filter(([key]) => key !== AUTHORIZATION_HEADER);
    authHeaders.forEach(h => request.headers?.push(h));
}

/**
 * This is low level function that will call the javascript HTTP fetch() API.
 *
 */
export const callApi = (request: ApiRequest): Promise<any> => {
    const requestInit: RequestInit = {
        method: request.method ? request.method : "GET"
    }

    if (request.headers) {
        requestInit.headers = request.headers;
    }

    if (request.payload) {
        if (typeof request.payload === "string") {
            requestInit.body = request.payload
        } else if (request.payload instanceof String) {
            requestInit.body = request.payload.toString();
        } else {
            requestInit.body = JSON.stringify(request.payload);
        }
    }

    const responsePromise: Promise<Response> = fetchWrapper(request.endpoint, requestInit);
    return new Promise((resolve, reject) => {
        responsePromise.then(response => {
            request.lastStatus = response.status;
            if (response.status === 200) {
                response.json().then(responseJson => {
                    resolve(responseJson);
                }, (error) => reject(error));
            } else {
                response.text().then(responseText => {
                    reject(responseText)
                }, (error) => reject(error));
            }
        }, (error) => {
            if (error instanceof String || typeof error === "string") {
                reject(error);
            } else {
                if (error) {
                    reject(JSON.stringify(error));
                } else {
                    reject();
                }
            }
        });
    });
}


/**
 * This is low level function that will call the javascript HTTP fetch() API.
 * And surround fetch with intercept methods
 *
 * On a 401 (and unless the request opted out via skipAuthRetry), this asks the
 * registered unauthorized handler for a refreshed Authorization header and
 * retries the request exactly once before giving up.
 */
export const callApiIntercept = (request: ApiRequest, interceptorCbs?: InterceptorCallBacks): Promise<any> => {
    if (interceptorCbs && interceptorCbs.before) {
        interceptorCbs.before();
    }
    return new Promise((resolve, reject) => {
        const settleError = (error: any) => {
            reject(error);
            if (interceptorCbs && interceptorCbs.afterError) {
                interceptorCbs.afterError.forEach(postError => postError(error));
            }
        }

        const attempt = (isRetry: boolean) => {
            callApi(request).then(response => {
                resolve(response);
                if (interceptorCbs && interceptorCbs.afterSuccess) {
                    interceptorCbs.afterSuccess.forEach(postSuccess => postSuccess(response));
                }
            }, error => {
                const shouldRetryAfterRefresh = !isRetry && !request.skipAuthRetry
                    && request.lastStatus === 401 && unauthorizedHandler;

                if (shouldRetryAfterRefresh) {
                    unauthorizedHandler!().then(authHeaders => {
                        setAuthHeader(request, authHeaders);
                        attempt(true);
                    }, () => settleError(error));
                } else {
                    settleError(error);
                }
            })
        };
        attempt(false);
    });
}
