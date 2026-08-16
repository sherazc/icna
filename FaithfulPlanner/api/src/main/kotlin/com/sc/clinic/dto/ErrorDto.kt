package com.sc.clinic.dto

data class ErrorDto(
    var message: String?,
    var field: String?) {
    constructor(message: String?) : this(message, null)
}
