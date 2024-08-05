package org.icna.register.entity.ui

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import org.icna.register.entity.event.Event


@Entity
data class Style(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne()
    @JoinColumn(name = "event_id", nullable = false)
    var event: Event,
    var styleType: StyleType,
    var styleName: String,
    var styleValue: String
)
