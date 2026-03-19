package com.sc.clinic.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

object DateUtils {

    private val ISO_LOCAL_DATE_FORMATTER: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE
    private val US_DATE_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy")
    private val MONTH_DAY_YEAR_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy")
    private val DAY_OF_WEEK_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("EEEE")

    fun dateToIso(date: LocalDate?): String = date?.format(ISO_LOCAL_DATE_FORMATTER) ?: ""

    fun isoToDate(value: String?): LocalDate? {
        if (value.isNullOrBlank()) return null
        return try {
            LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
        } catch (ex: DateTimeParseException) {
            null
        }
    }

    fun isoToUs(value: String?): String {
        if (value.isNullOrBlank()) return ""
        return try {
            val date = LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
            date.format(US_DATE_FORMATTER)
        } catch (ex: DateTimeParseException) {
            ""
        }
    }

    fun localDateToUs(date: LocalDate?): String = date?.format(US_DATE_FORMATTER) ?: ""

    fun isoToMonthDayYear(value: String?): String {
        if (value.isNullOrBlank()) return ""
        return try {
            val date = LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
            date.format(MONTH_DAY_YEAR_FORMATTER)
        } catch (ex: DateTimeParseException) {
            ""
        }
    }

    fun isoToDayOfWeek(value: String?): String {
        if (value.isNullOrBlank()) return ""
        return try {
            val date = LocalDate.parse(value, ISO_LOCAL_DATE_FORMATTER)
            date.format(DAY_OF_WEEK_FORMATTER)
        } catch (ex: DateTimeParseException) {
            ""
        }
    }
}