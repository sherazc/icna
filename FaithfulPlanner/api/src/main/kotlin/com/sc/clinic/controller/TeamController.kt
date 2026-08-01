package com.sc.clinic.controller

import com.sc.clinic.dto.TeamDto
import com.sc.clinic.service.TeamService
import org.springframework.security.access.prepost.PreAuthorize
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
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    @GetMapping
    fun getAllTeams(@PathVariable companyId: Long): List<TeamDto> = teamService.getAllTeamDtoList(companyId)

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @PostMapping
    fun saveTeam(@PathVariable companyId: Long, @RequestBody teams: List<TeamDto>): List<TeamDto> =
        teamService.saveTeam(companyId, teams)

}