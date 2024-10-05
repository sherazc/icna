package org.icna.register.exception

class ErExceptionBadRequest: ErException {
    constructor(message: String) : super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
}