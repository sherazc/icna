package com.sc.clinic.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.util.stream.Collectors

@ControllerAdvice
class ScGlobalExceptionHandler {

    @ExceptionHandler(MyException::class)
    fun handleMyException(e: MyException): ResponseEntity<MyErrorResponse?> {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body<T?>(e.getMyErrorResponse())
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleException(exception: MethodArgumentNotValidException): ResponseEntity<MyErrorResponse?> {
        val bindingResult = exception.getBindingResult()

        val errorMessage = bindingResult.getFieldErrors().stream()
            .map<String?> { f: FieldError? -> f!!.getField() + ":" + f.getDefaultMessage() }
            .collect(Collectors.joining(","))

        val fields = bindingResult.getFieldErrors().stream()
            .map<String?> { obj: FieldError? -> obj!!.getField() }
            .collect(Collectors.joining("."))

        val errorResponse: MyErrorResponse = MyErrorResponse(
            String.format("Invalid Request: %s", errorMessage),
            fields,
            "400"
        )

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body<MyErrorResponse?>(errorResponse)
    }
}