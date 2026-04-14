package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UiThemeDto(
    @param:JsonProperty("id")
    var id: Long,
    @param:JsonProperty("displayName")
    var displayName: String,
    @param:JsonProperty("displayColorHex")
    var displayColorHex: String,
    @param:JsonProperty("name")
    var name: String,
)
