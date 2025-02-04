package com.sc.event.mapper

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class LocalDateTimeDeserializer : JsonDeserializer<LocalDateTime>() {

    companion object {
        private val DATE_TIME_REGEX = "\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d(:[0-5]\\d)?[:.+\\-0-9Zz]{0,11}".toRegex()
        private val DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")
    }

    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): LocalDateTime? {
        return if (!DATE_TIME_REGEX.matches(jsonParser.text))
            null
        else LocalDateTime.parse(jsonParser.text.subSequence(0, 16), DATE_TIME_FORMATTER)
    }
}