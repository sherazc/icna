package com.sc.clinic.exception

import com.sc.clinic.dto.ErrorDto
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ScGlobalExceptionHandler {

    @ExceptionHandler(ScException::class)
    fun handleScException(exception: ScException): ResponseEntity<List<ErrorDto>> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            listOf(ErrorDto(exception.message, exception.field))
        )
    }

    @ExceptionHandler(ScBadRequestException::class)
    fun handleScBadRequestException(exception: ScBadRequestException): ResponseEntity<List<ErrorDto>> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            listOf(ErrorDto(exception.message, exception.field))
        )
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentException(exception: MethodArgumentNotValidException): ResponseEntity<List<ErrorDto>> {
        val bindingResult = exception.bindingResult

        val errors = mutableListOf<ErrorDto>()

        if (bindingResult.globalError != null && bindingResult.globalError?.defaultMessage != null)
            errors.add(ErrorDto(bindingResult.globalError?.defaultMessage))

        if (bindingResult.fieldErrors.isNotEmpty()) {
            bindingResult.fieldErrors
                .forEach { fieldError -> errors.add(ErrorDto(fieldError.defaultMessage, fieldError.field)) }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors)
    }

    @ExceptionHandler(Exception::class)
    fun handleScException(exception: Exception) = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ErrorDto(exception.message, null))

}