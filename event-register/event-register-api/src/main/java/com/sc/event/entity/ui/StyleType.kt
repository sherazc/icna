package com.sc.event.entity.ui

enum class StyleType {
    VAR_COLOR,
    VAR_SIZE,
    VAR_STRING;

    companion object {
        private val map = entries.associateBy(StyleType::name)
        fun fromString(type: String): StyleType? = map[type]
    }
}