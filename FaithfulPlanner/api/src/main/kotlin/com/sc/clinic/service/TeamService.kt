package com.sc.clinic.service

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.entity.Team
import com.sc.clinic.repository.TeamRepository
import org.springframework.stereotype.Service

@Service
class TeamService(
    private val teamRepository: TeamRepository,
    private val companyService: CompanyService,
    private val teamEmployeeTypeService: TeamEmployeeTypeService
) {
    fun getAllTeams(companyId: Long): List<Team> = teamRepository.findByCompanyId(companyId)

    fun getAllTeamDtoList(companyId: Long): List<TeamDto> = getAllTeams(companyId).map { TeamDto(it) }

    fun saveTeam(companyId: Long, teamDtoList: List<TeamDto>): TeamDto {

        val company = companyService.findById(companyId)
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
            team.employeeTypes.forEach { et -> teamEmployeeTypeService.deleteIfNotExists(team.id, et.id, teamDtoList)}
        }


        TODO("Not yet implemented - Make it like EmployeeGroupService.save()")
    }




}