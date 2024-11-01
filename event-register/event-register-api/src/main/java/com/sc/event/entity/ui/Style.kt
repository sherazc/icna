package com.sc.event.entity.ui

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import com.sc.event.entity.event.Event
import com.sc.event.service.StyleVariableTypeJpaConverter
import jakarta.persistence.Convert


@Entity
data class Style(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne()
    @JoinColumn(name = "event_id", nullable = false)
    var event: Event,

    @Convert(converter = StyleVariableTypeJpaConverter::class)
    var styleType: StyleType,
    var styleName: String,
    var styleValue: String
)
