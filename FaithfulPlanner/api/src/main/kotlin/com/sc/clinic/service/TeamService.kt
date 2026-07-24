package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.Team
import com.sc.clinic.entity.TeamEmployeeType
import com.sc.clinic.repository.TeamRepository
import org.springframework.stereotype.Service

@Service
class TeamService(
    private val teamRepository: TeamRepository,
    private val companyService: CompanyService,
    private val teamEmployeeTypeService: TeamEmployeeTypeService
) {
    fun getAllTeams(companyId: Long): List<Team> = teamRepository.findByCompanyId(companyId)

    fun getAllTeamDtoList(companyId: Long): List<TeamDto> =
        getAllTeams(companyId).map { t -> TeamDto(t, t.employeeTypes.sortedBy { et -> et.employeeType.typeName }) }
            .sortedBy { t -> t.teamName }

    fun saveTeam(companyId: Long, teamDtoList: List<TeamDto>): List<TeamDto> {
        val existingTeams = teamRepository.findByCompanyId(companyId)

        // Delete Team - That user deleted
        existingTeams.forEach { existingTeam ->
            val noneExists = teamDtoList.none { tDto -> existingTeam.id == tDto.id }
            if (noneExists) {
                teamEmployeeTypeService.deleteByTeamId(existingTeam.id)
                teamRepository.deleteById(existingTeam.id)
            }
        }

        // Delete Team Employee Type - That user deleted
        existingTeams.forEach { team ->
            team.employeeTypes.forEach { et ->
                teamEmployeeTypeService.deleteIfNotExists(team.id, et.id, teamDtoList)
            }
        }

        // Save Team and its employee types
        val company = companyService.findById(companyId)
        return teamDtoList.map { teamDto ->
            val team: Team = getOrCreateTeam(teamDto, company)
            teamRepository.save(team)
            val teamEmployeeTypes: List<TeamEmployeeType> =
                teamDto.employeeTypes.map { teamEmployeeTypeService.save(team, it) }

            TeamDto(team, teamEmployeeTypes)
            // TeamDto(team, teamEmployeeTypes.sortedBy { it.employeeType.typeName })
        }// .sortedBy { it.teamName }
    }

    private fun getOrCreateTeam(teamDto: TeamDto, company: Company): Team {
        return if ((teamDto.id ?: 0) > 0) {
            teamRepository.findById(teamDto.id)
                .orElse(Team(null, company, teamDto.teamName, mutableSetOf()))
        } else {
            Team(null, company, teamDto.teamName, mutableSetOf())
        }
    }


}