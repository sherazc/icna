package com.sc.clinic.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

object DateUtils {

    private val ISO_LOCAL_DATE_FORMATTER: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE

    fun dateToIso(date: LocalDate?): String = date?.format(ISO_LOCAL_DATE_FORMATTER) ?: ""

    fun isoToDate(value: String?): LocalDate? {
        if (value.isNullOrBlank()) return null
        return try {
            LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
        } catch (ex: DateTimeParseException) {
            null
        }
    }
}