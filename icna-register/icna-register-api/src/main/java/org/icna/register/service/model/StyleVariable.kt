package org.icna.register.service.model

data class StyleVariable(val styleName: String, val styleValue: String)

fun  getDefaultEntityStyleVariables() = listOf(
    StyleVariable("colorPrimary", "#3e598e"),
    StyleVariable("colorSecondary", "#bbb"),
    StyleVariable("colorTertiary", "gray"),
    StyleVariable("colorDarkText", "#222"),
    StyleVariable("colorLightText", "#ffffffdd"),
    StyleVariable("colorDarkHeading", "#blue"),
    StyleVariable("colorLightHeading", "#eee"),
    StyleVariable("colorShadow", "#00000033"),
    StyleVariable("sizeText", "1.5rem"),
    StyleVariable("sizeH1", "2.5rem"),
    StyleVariable("sizeH2", "2.2rem"),
    StyleVariable("sizeH3", "2.0rem"),
    StyleVariable("sizeH4", "1.8rem"),
    StyleVariable("borderRadiusForm", "5px"),
);

