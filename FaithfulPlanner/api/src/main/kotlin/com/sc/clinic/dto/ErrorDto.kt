package com.sc.clinic.dto

class ErrorDto(
    var message: String?,
    var field: String?) {
    constructor(message: String?) : this(message, null)
}
