package org.icna.register.service.model

data class EventStyleVariable(val name: String, val value: String) {

    fun getDefaultVariables() = listOf(
        EventStyleVariable("primaryColor", "red")
    );
}

