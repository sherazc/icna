package com.sc.clinic.exception

import com.sc.clinic.dto.ScErrorResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.util.stream.Collectors

@ControllerAdvice
class ScGlobalExceptionHandler {

    @ExceptionHandler(ScException::class)
    fun handleScException(exception: ScException): ResponseEntity<List<ScErrorResponse>> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            listOf(ScErrorResponse(exception.message, exception.field))
        )
    }

    @ExceptionHandler(ScBadRequestException::class)
    fun handleScBadRequestException(exception: ScBadRequestException): ResponseEntity<List<ScErrorResponse>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            listOf(ScErrorResponse(exception.message, exception.field))
        )
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentException(exception: MethodArgumentNotValidException): ResponseEntity<List<ScErrorResponse>> {
        val bindingResult = exception.bindingResult

        val errors = mutableListOf<ScErrorResponse>()

        if (bindingResult.globalError != null && bindingResult.globalError?.defaultMessage != null)
            errors.add(ScErrorResponse(bindingResult.globalError?.defaultMessage))

        if (bindingResult.fieldErrors.isNotEmpty()) {
            bindingResult.fieldErrors
                .forEach { fieldError -> errors.add(ScErrorResponse(fieldError.defaultMessage, fieldError.field)) }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors)
    }

    @ExceptionHandler(Exception::class)
    fun handleScException(exception: Exception) = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ScErrorResponse(exception.message, null))

}