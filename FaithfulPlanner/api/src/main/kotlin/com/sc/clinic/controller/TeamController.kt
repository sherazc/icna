package com.sc.clinic.controller

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.service.TeamService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/company/{companyId}/teams")
class TeamController(
    private val teamService: TeamService
) {
    @GetMapping
    fun getAllTeams(@PathVariable companyId: Long): List<TeamDto> = teamService.getAllTeamDtoList(companyId)

    @PostMapping
    fun saveTeam(@PathVariable companyId: Long, @RequestBody teams: List<TeamDto>): TeamDto =
        teamService.saveTeam(companyId, teams)

}