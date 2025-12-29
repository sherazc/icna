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
    fun handleScException(exception: ScException): ResponseEntity<ScErrorResponse> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body<ScErrorResponse>(ScErrorResponse(
            exception.message, exception.field, "500"
        ))
    }

    @ExceptionHandler(ScBadRequestException::class)
    fun handleScBadRequestException(exception: ScBadRequestException): ResponseEntity<ScErrorResponse> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body<ScErrorResponse>(ScErrorResponse(
            exception.message, exception.field, "400"
        ))
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentException(exception: MethodArgumentNotValidException): ResponseEntity<ScErrorResponse> {
        val bindingResult = exception.bindingResult

        val errorMessage = bindingResult.fieldErrors.stream()
            .map<String?> { f: FieldError? -> f!!.field + ":" + f.defaultMessage }
            .collect(Collectors.joining(","))

        val fields = bindingResult.fieldErrors.stream()
            .map<String?> { obj: FieldError? -> obj!!.field }
            .collect(Collectors.joining("."))

        val errorResponse: ScErrorResponse = ScErrorResponse(
            String.format("Invalid Request: %s", errorMessage),
            fields,
            "400"
        )

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body<ScErrorResponse>(errorResponse)
    }

    @ExceptionHandler(Exception::class)
    fun handleScException(exception: Exception): ResponseEntity<ScErrorResponse> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body<ScErrorResponse>(ScErrorResponse(
            exception.message, null, "500"
        ))
    }
}