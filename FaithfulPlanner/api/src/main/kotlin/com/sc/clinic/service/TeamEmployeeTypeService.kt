package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.repository.TeamEmployeeTypeRepository
import org.springframework.stereotype.Service

@Service
class TeamEmployeeTypeService(
    val teamEmployeeTypeRepository: TeamEmployeeTypeRepository
) {
    fun deleteByTeamId(id: Long?): Long = id?.let { teamEmployeeTypeRepository.deleteByTeamId(it) } ?: 0L

    fun deleteIfNotExists(teamId: Long?, employeeTypeId: Long?, teamDtoList: List<TeamDto>) {
        if (teamId == null || employeeTypeId == null) return

        val employeeTypeFound = teamDtoList.any { teamDto -> teamDto.employeeTypes.any {
            et -> teamId == teamDto.id && et.id == employeeTypeId }}

        if (!employeeTypeFound) {
            teamEmployeeTypeRepository.deleteByTeamIdAndEmployeeTypeId(teamId, employeeTypeId)
        }
    }
}