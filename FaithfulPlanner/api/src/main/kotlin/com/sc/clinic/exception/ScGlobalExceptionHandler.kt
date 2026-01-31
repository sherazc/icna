package com.sc.clinic.exception

import com.sc.clinic.dto.ErrorDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authorization.AuthorizationDeniedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ScGlobalExceptionHandler {
    // Kotlin do not have static class members
    // companion object{} is alternative to create static class members
    companion object {
        // :: is reflection operator
        // ::class returns Kotlin's KClass
        // ::class.java returns Java's Class
        // This logger is a recommended approach in Kotlin Spring Boot application
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    @ExceptionHandler(ScException::class)
    fun handleScException(exception: ScException): ResponseEntity<List<ErrorDto>> {
        logger.error("ScException", exception)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            listOf(ErrorDto(exception.message, exception.field))
        )
    }

    @ExceptionHandler(ScBadRequestException::class)
    fun handleScBadRequestException(exception: ScBadRequestException): ResponseEntity<List<ErrorDto>> {
        logger.error("ScBadRequestException", exception)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            listOf(ErrorDto(exception.message, exception.field))
        )
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentException(exception: MethodArgumentNotValidException): ResponseEntity<List<ErrorDto>> {
        logger.error("MethodArgumentNotValidException", exception)
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

    @ExceptionHandler(AuthorizationDeniedException::class)
    fun handleAuthorizationDeniedException(exception: AuthorizationDeniedException): ResponseEntity<List<ErrorDto>> {
        logger.error("AuthorizationDeniedException", exception)
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(listOf(
            ErrorDto("Not Authorized. ${exception.message}.", null)))
    }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(exception: AccessDeniedException): ResponseEntity<List<ErrorDto>> {
        logger.error("AccessDeniedException", exception)
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(listOf(
            ErrorDto("Not Authenticated. ${exception.message}.", null)))
    }

    @ExceptionHandler(Exception::class)
    fun handleScException(exception: Exception): ResponseEntity<List<ErrorDto>> {
        logger.error("Exception", exception)
        return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(listOf(ErrorDto(exception.message, null)))
    }
}