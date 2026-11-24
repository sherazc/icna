package com.sc.clinic.entity

import jakarta.persistence.*
import java.io.Serializable

@Embeddable
data class OperationDayTeamInstanceId(
    @Column(name = "operation_day_id", nullable = false)
    var operationDayId: Long,

    @Column(name = "team_id", nullable = false)
    var teamId: Long,

    @Column(name = "instance_no", nullable = false)
    var instanceNo: Int
) : Serializable

@Entity
@Table(name = "operation_day_team_instance")
class OperationDayTeamInstance(
    @EmbeddedId
    var id: OperationDayTeamInstanceId
)
