package com.sc.clinic.service

import com.sc.clinic.dto.UiThemeDto
import org.springframework.stereotype.Service

@Service
class RefUiThemeService {
    val defaultId = 10L

    val allThemes = listOf(
        UiThemeDto(defaultId, "Default", "", ""),
        UiThemeDto(20, "Blue", "", "blue-theme.css"),
        UiThemeDto(30, "Dark Slate", "", "dark-slate-theme.css"),
        UiThemeDto(40, "Dark Teal", "", "dark-teal-theme.css"),
        UiThemeDto(50, "Dark", "", "dark-theme.css"),
        UiThemeDto(60, "Green", "", "green-theme.css"),
        UiThemeDto(70, "Orange", "", "orange-theme.css"),
        UiThemeDto(80, "Purple", "", "purple-theme.css"),
        UiThemeDto(90, "Red", "", "red-theme.css"),
    )

    fun getAll() = allThemes

    fun getById(id: Long): UiThemeDto = allThemes.firstOrNull { it.id == id } ?: getDefaultTheme()

    fun getDefaultTheme(): UiThemeDto = allThemes.first { it.id == defaultId }
}