package org.icna.register.service.model

data class StyleVariable(val name: String, val value: String)

fun  getDefaultEntityStyleVariables() = listOf(
    StyleVariable("primaryColor", "red"),
    StyleVariable("secondaryColor", "blue")
);

