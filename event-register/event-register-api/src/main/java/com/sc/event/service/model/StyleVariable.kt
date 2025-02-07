package com.sc.event.service.model

import com.sc.event.entity.ui.StyleType

/**
 * Lookup for all the available styles and their default values.
 *
 * Used to build CSS style-sheet
 */
data class StyleVariable(
    var id: Long?,
    val styleName: String,
    val styleValue: String,
    val styleType: StyleType)

fun getDefaultEntityStyleVariables() = listOf(
    StyleVariable(null, "colorPrimary", "#3e598e", StyleType.VAR_COLOR),
    StyleVariable(null, "colorSecondary", "#bbbbbb", StyleType.VAR_COLOR),
    StyleVariable(null, "colorTertiary", "#808080", StyleType.VAR_COLOR),
    StyleVariable(null, "colorDarkText", "#222222", StyleType.VAR_COLOR),
    StyleVariable(null, "colorLightText", "#ffffffdd", StyleType.VAR_COLOR),
    StyleVariable(null, "colorDarkHeading", "#0000ff", StyleType.VAR_COLOR),
    StyleVariable(null, "colorLightHeading", "#eeeeee", StyleType.VAR_COLOR),
    StyleVariable(null, "colorShadow", "#00000033", StyleType.VAR_COLOR),
    StyleVariable(null, "sizeText", "1.5rem", StyleType.VAR_SIZE),
    StyleVariable(null, "sizeH1", "2.5rem", StyleType.VAR_SIZE),
    StyleVariable(null, "sizeH2", "2.2rem", StyleType.VAR_SIZE),
    StyleVariable(null, "sizeH3", "2.0rem", StyleType.VAR_SIZE),
    StyleVariable(null, "sizeH4", "1.8rem", StyleType.VAR_SIZE),
    StyleVariable(null, "borderRadiusForm", "5px", StyleType.VAR_SIZE),
)
