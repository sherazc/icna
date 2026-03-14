package com.sc.clinic.util

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import java.time.LocalDate

class DateUtilsTest {

    @Test
    fun `dateToIso formats LocalDate correctly`() {
        val date = LocalDate.of(2026, 3, 14)
        val result = DateUtils.dateToIso(date)
        assertEquals("2026-03-14", result)
    }

    @Test
    fun `dateToIso returns empty string for null`() {
        val date: LocalDate? = null
        val result = DateUtils.dateToIso(date)
        assertEquals("", result)
    }

    @Test
    fun `isoToDate parses valid ISO date`() {
        val result = DateUtils.isoToDate("2026-03-14")
        assertEquals(LocalDate.of(2026, 3, 14), result)
    }

    @Test
    fun `isoToDate returns null for blank or invalid`() {
        assertNull(DateUtils.isoToDate(null))
        assertNull(DateUtils.isoToDate(""))
        assertNull(DateUtils.isoToDate("   "))
        assertNull(DateUtils.isoToDate("14-03-2026"))
    }

    @Test
    fun `round trip LocalDate to string and back`() {
        val original = LocalDate.of(2024, 2, 29)
        val str = DateUtils.dateToIso(original)
        val parsed = DateUtils.isoToDate(str)
        assertEquals(original, parsed)
    }
}