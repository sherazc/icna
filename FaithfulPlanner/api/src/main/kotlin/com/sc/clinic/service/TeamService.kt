package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.Team
import com.sc.clinic.entity.TeamEmployeeType
import com.sc.clinic.repository.TeamRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class TeamService(
    private val teamRepository: TeamRepository,
    private val companyService: CompanyService,
    private val teamEmployeeTypeService: TeamEmployeeTypeService,
    private val operationDayTeamService: OperationDayTeamService
) {
    fun getAllTeams(companyId: Long): List<Team> = teamRepository.findByCompanyId(companyId)

    fun getAllTeamDtoList(companyId: Long): List<TeamDto> =
        getAllTeams(companyId).map { t ->
            val employeeTypes = t.teamEmployeeTypes.toList() // snapshot before sorting
            TeamDto(t, employeeTypes.sortedBy { et -> et.employeeType.typeName })
        }
            .sortedBy { t -> t.teamName }

    @Transactional
    fun saveTeam(companyId: Long, teamDtoList: List<TeamDto>): List<TeamDto> {
        val existingTeams = teamRepository.findByCompanyId(companyId)

        // Delete Team Employee Type - That user deleted
        existingTeams.forEach { team ->
            team.teamEmployeeTypes.forEach { et ->
                teamEmployeeTypeService.deleteIfNotExists(team.id, et.employeeType.id, teamDtoList)
            }
        }

        // Delete Team - That user deleted
        existingTeams.forEach { existingTeam ->
            val noneExists = teamDtoList.none { tDto -> existingTeam.id == tDto.id }
            if (noneExists) {
                teamEmployeeTypeService.deleteByTeamId(existingTeam.id) // Delete Team's Employee Types
                existingTeam.id?.let { teamRepository.deleteById(it) } // Delete Team
            }
        }

        // Save Team and its employee types
        val company = companyService.findById(companyId)
        return teamDtoList.map { teamDto ->
            val team: Team = getOrCreateTeam(teamDto, company)
            team.teamName = teamDto.teamName
            teamRepository.save(team)
            /*
            TODO: Look into this issue
                It creates new ID of TeamEmployeeType every time it saves
            */
            val teamEmployeeTypes: List<TeamEmployeeType> =
                teamDto.teamEmployeeTypes.mapNotNull { teamEmployeeTypeService.save(team, it) }

            TeamDto(team, teamEmployeeTypes)
            // TeamDto(team, teamEmployeeTypes.sortedBy { it.employeeType.typeName })
        }// .sortedBy { it.teamName }
    }

    private fun getOrCreateTeam(teamDto: TeamDto, company: Company): Team {
        val teamId: Long? = teamDto.id
        return if (teamId != null && teamId > 0) {
            teamRepository.findById(teamId)
                .map { team ->
                    team.teamEmployeeTypes = mutableSetOf()
                    team
                }
                .orElse(Team(null, company, teamDto.teamName, mutableSetOf()))
        } else {
            Team(null, company, teamDto.teamName, mutableSetOf())
        }
    }

    @Transactional
    fun deleteTeam(companyId: Long, teamId: Long): Boolean {
        teamEmployeeTypeService.deleteByTeamId(teamId)
        operationDayTeamService.deleteByTeamId(teamId)
        teamRepository.deleteById(teamId)
        return true
    }

    fun findById(teamId: Long?): Team? = teamId?.let { teamRepository.findById(it).orElse(null) }
}