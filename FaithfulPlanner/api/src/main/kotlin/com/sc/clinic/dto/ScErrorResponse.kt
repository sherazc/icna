package com.sc.clinic.dto

data class ScErrorResponse(
    var message: String?,
    var field: String?) {
    constructor(message: String?) : this(message, null)
}
