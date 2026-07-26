package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.dto.TeamEmployeeTypeDto
import com.sc.clinic.entity.EmployeeType
import com.sc.clinic.entity.Team
import com.sc.clinic.entity.TeamEmployeeType
import com.sc.clinic.repository.TeamEmployeeTypeRepository
import org.springframework.stereotype.Service

@Service
class TeamEmployeeTypeService(
    val teamEmployeeTypeRepository: TeamEmployeeTypeRepository,
    val employeeTypeService: EmployeeTypeService
) {
    fun deleteByTeamId(id: Long?): Long = id?.let { teamEmployeeTypeRepository.deleteByTeamId(it) } ?: 0L

    fun deleteIfNotExists(teamId: Long?, employeeTypeId: Long?, teamDtoList: List<TeamDto>) {
        if (teamId == null || employeeTypeId == null) return

        val employeeTypeFound = teamDtoList.any { teamDto ->
            teamDto.employeeTypes.any { et -> teamId == teamDto.id && et.id == employeeTypeId }
        }

        if (!employeeTypeFound) {
            teamEmployeeTypeRepository.deleteByTeamIdAndEmployeeTypeId(teamId, employeeTypeId)
        }
    }

    fun save(team: Team, teamEmployeeTypeDto: TeamEmployeeTypeDto): TeamEmployeeType? {
        val teamId: Long = team.id ?: return null
        val employeeTypeId: Long = teamEmployeeTypeDto.employeeType.id ?: return null

        var teamEmployeeType =
            teamEmployeeTypeRepository.findByTeamIdAndEmployeeTypeId(teamId, employeeTypeId)?.let { tet ->
                tet.requiredCount = teamEmployeeTypeDto.requiredCount
                tet
            }

        if (teamEmployeeType == null) {
            val employeeType: EmployeeType = employeeTypeService.findById(employeeTypeId) ?: return null
            teamEmployeeType = TeamEmployeeType(null, team, employeeType, teamEmployeeTypeDto.requiredCount)
        }

        return teamEmployeeTypeRepository.save(teamEmployeeType)
    }
}