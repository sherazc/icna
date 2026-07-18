package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.entity.Team
import com.sc.clinic.repository.TeamRepository
import org.springframework.stereotype.Service

@Service
class TeamService(private val teamRepository: TeamRepository) {
    fun getAllTeams(companyId: Long): List<Team> = teamRepository.findByCompanyId(companyId)

    fun getAllTeamDtoList(companyId: Long): List<TeamDto> = getAllTeams(companyId).map { TeamDto(it) }
    fun saveTeam(companyId: Long, teamDto: List<TeamDto>): TeamDto {
        TODO("Not yet implemented - Make it like EmployeeGroupService.save()")
    }

}