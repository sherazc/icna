package com.sc.clinic.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

object DateUtils {

    private val ISO_LOCAL_DATE_FORMATTER: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE
    private val US_DATE_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy")

    fun dateToIso(date: LocalDate?): String = date?.format(ISO_LOCAL_DATE_FORMATTER) ?: ""

    fun isoToDate(value: String?): LocalDate? {
        if (value.isNullOrBlank()) return null
        return try {
            LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
        } catch (ex: DateTimeParseException) {
            null
        }
    }

    fun isoToUs(value: String?): String? {
        if (value.isNullOrBlank()) return null
        return try {
            val date = LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
            date.format(US_DATE_FORMATTER)
        } catch (ex: DateTimeParseException) {
            null
        }
    }

    fun localDateToUs(date: LocalDate?): String = date?.format(US_DATE_FORMATTER) ?: ""
}