package com.sc.event.service

import com.sc.event.entity.ui.StyleType
import jakarta.persistence.AttributeConverter

class StyleVariableTypeJpaConverter : AttributeConverter<StyleType, String> {
    override fun convertToDatabaseColumn(styleType: StyleType?): String? = styleType?.name

    override fun convertToEntityAttribute(styleTypeString: String?): StyleType? {
        if (styleTypeString == null) return null
        return StyleType.entries.firstOrNull { st -> st.name.equals(styleTypeString) }
    }
}