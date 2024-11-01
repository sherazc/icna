package com.sc.event.service.model

import com.sc.event.entity.ui.StyleType

data class StyleVariable(
    val styleName: String,
    val styleValue: String,
    val styleType: StyleType)

fun getDefaultEntityStyleVariables() = listOf(
    StyleVariable("colorPrimary", "#3e598e", StyleType.VAR_COLOR),
    StyleVariable("colorSecondary", "#bbb", StyleType.VAR_COLOR),
    StyleVariable("colorTertiary", "gray", StyleType.VAR_COLOR),
    StyleVariable("colorDarkText", "#222", StyleType.VAR_COLOR),
    StyleVariable("colorLightText", "#ffffffdd", StyleType.VAR_COLOR),
    StyleVariable("colorDarkHeading", "#blue", StyleType.VAR_COLOR),
    StyleVariable("colorLightHeading", "#eee", StyleType.VAR_COLOR),
    StyleVariable("colorShadow", "#00000033", StyleType.VAR_COLOR),
    StyleVariable("sizeText", "1.5rem", StyleType.VAR_SIZE),
    StyleVariable("sizeH1", "2.5rem", StyleType.VAR_SIZE),
    StyleVariable("sizeH2", "2.2rem", StyleType.VAR_SIZE),
    StyleVariable("sizeH3", "2.0rem", StyleType.VAR_SIZE),
    StyleVariable("sizeH4", "1.8rem", StyleType.VAR_SIZE),
    StyleVariable("borderRadiusForm", "5px", StyleType.VAR_SIZE),
)
