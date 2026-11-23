package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.Team
import com.sc.clinic.entity.TeamEmployeeType
import com.sc.clinic.exception.ScException
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.TeamRepository
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class TeamService(
    private val teamRepository: TeamRepository,
    private val companyService: CompanyService,
    private val teamEmployeeTypeService: TeamEmployeeTypeService,
    private val operationDayTeamService: OperationDayTeamService,
    private val operationDayService: OperationDayService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    fun getAllTeams(companyId: Long): List<Team> = teamRepository.findByCompanyId(companyId)

    fun getAllTeamDtoList(companyId: Long): List<TeamDto> =
        getAllTeams(companyId).map { t ->
            val employeeTypes = t.teamEmployeeTypes.toList() // snapshot before sorting
            TeamDto(t, employeeTypes.sortedBy { et -> et.employeeType.typeName })
        }
            .sortedBy { t -> t.teamName }

    @Transactional
    fun saveTeam(companyId: Long, teamDtoList: List<TeamDto>): List<TeamDto> {
        logger.debug("Saving team. CompanyId: {}, teams size: {}", companyId, teamDtoList.size)
        val existingTeams = teamRepository.findByCompanyId(companyId)

        logger.debug("Delete Team Employee Type - That user deleted")
        existingTeams.forEach { team ->
            team.teamEmployeeTypes.forEach { et ->
                teamEmployeeTypeService.deleteIfNotExists(team.id, et.employeeType.id, teamDtoList)
            }
        }

        logger.debug("Delete Team - That user deleted")
        existingTeams.forEach { existingTeam ->
            val noneExists = teamDtoList.none { tDto -> existingTeam.id == tDto.id }
            if (noneExists) {
                teamEmployeeTypeService.deleteByTeamId(existingTeam.id) // Delete Team's Employee Types
                deleteTeam(existingTeam)  // Delete Team
            }
        }

        logger.debug("Save Team and its employee types")
        val company = companyService.findById(companyId)
        return teamDtoList.map { teamDto ->
            val team: Team = getOrCreateTeam(teamDto, company)
            team.teamName = teamDto.teamName
            teamRepository.save(team)
            logger.info("Team {} saved", team.teamName)
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

    private fun deleteTeam(team: Team) {
        val teamId = team.id ?: return

        val operationDayLinkedToTeam = operationDayService.findByTeamId(teamId)
        if (operationDayLinkedToTeam.isNotEmpty()) {
            val datesString: String = operationDayLinkedToTeam.joinToString(", ") { op -> op.serviceDateString }
            val errorMessage = "${team.teamName} is used on $datesString"
            logger.error(errorMessage)
            throw ScException(errorMessage)
        }
        teamRepository.deleteById(teamId)
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