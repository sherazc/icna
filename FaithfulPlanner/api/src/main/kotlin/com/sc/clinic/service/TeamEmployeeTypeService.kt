package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.dto.TeamEmployeeTypeDto
import com.sc.clinic.entity.EmployeeType
import com.sc.clinic.entity.Team
import com.sc.clinic.entity.TeamEmployeeType
import com.sc.clinic.repository.ScheduleRepository
import com.sc.clinic.repository.TeamEmployeeTypeRepository
import org.springframework.stereotype.Service

@Service
class TeamEmployeeTypeService(
    val teamEmployeeTypeRepository: TeamEmployeeTypeRepository,
    val employeeTypeService: EmployeeTypeService,
    private val scheduleRepository: ScheduleRepository
) {
    fun deleteByTeamId(teamId: Long?): Long {
        if (teamId == null) return 0L
        scheduleRepository.unplaceByTeamId(teamId)
        return teamEmployeeTypeRepository.deleteByTeamId(teamId)
    }

    fun deleteIfNotExists(teamId: Long?, employeeTypeId: Long?, teamDtoList: List<TeamDto>) {
        if (teamId == null || employeeTypeId == null) return

        val employeeTypeFound = teamDtoList.any { teamDto ->
            teamDto.teamEmployeeTypes.any { et -> teamId == teamDto.id && et.employeeType.id == employeeTypeId }
        }

        if (!employeeTypeFound) {
            scheduleRepository.unplaceByTeamIdAndEmployeeTypeId(teamId, employeeTypeId)
            teamEmployeeTypeRepository.deleteByTeamIdAndEmployeeTypeId(teamId, employeeTypeId)
        }
    }

    fun save(team: Team, teamEmployeeTypeDto: TeamEmployeeTypeDto): TeamEmployeeType? {
        val teamId: Long = team.id ?: return null
        val employeeTypeId: Long = teamEmployeeTypeDto.employeeType.id ?: return null

        var teamEmployeeType =
            teamEmployeeTypeRepository.findByTeamIdAndEmployeeTypeId(teamId, employeeTypeId)?.let { tet ->
                tet.requiredEmployeeTypeCount = teamEmployeeTypeDto.requiredEmployeeTypeCount
                tet
            }

        if (teamEmployeeType == null) {
            val employeeType: EmployeeType = employeeTypeService.findById(employeeTypeId) ?: return null
            teamEmployeeType = TeamEmployeeType(null, team, employeeType, teamEmployeeTypeDto.requiredEmployeeTypeCount)
        }

        return teamEmployeeTypeRepository.save(teamEmployeeType)
    }
}