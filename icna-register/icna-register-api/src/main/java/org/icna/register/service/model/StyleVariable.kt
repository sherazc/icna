package org.icna.register.service.model

data class StyleVariable(val styleName: String, val styleValue: String)

fun  getDefaultEntityStyleVariables() = listOf(
    StyleVariable("primaryColor", "red"),
    StyleVariable("secondaryColor", "blue")
);

