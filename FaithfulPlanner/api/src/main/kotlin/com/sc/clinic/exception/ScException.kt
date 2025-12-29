package com.sc.clinic.exception

import java.lang.RuntimeException

open class ScException : RuntimeException {
    val field: String?

    constructor(message: String) : super(message) {
        field = null
    }

    constructor(field: String, message: String) : super(message) {
        this.field = field
    }

    constructor(field: String, message: String, cause: Throwable) : super(message, cause) {
        this.field = field
    }
}

class ScBadRequestException : ScException {
    constructor(message: String) : super(message)
    constructor(field: String, message: String) : super(field, message)
    constructor(field: String, message: String, cause: Throwable) : super(field, message, cause)
}
