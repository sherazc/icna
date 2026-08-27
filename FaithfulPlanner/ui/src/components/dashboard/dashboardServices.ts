import type { 
  OpDayDetailDto, 
  OpDayDetailUserProfileDto, 
  TeamViewSpot, 
  TeamDto, 
  TeamView 
} from "../../service/service-types";

export const teamToTeamView = (team: TeamDto): TeamView => {
  const spots: TeamViewSpot[] = [];

  team.teamEmployeeTypes.forEach(tet => {
    for (let i = 0; i < tet.requiredEmployeeTypeCount; i++) {
      spots.push({ employeeType: tet.employeeType });
    }
  });

  const sortedSpots = spots.sort((s1, s2) => s1.employeeType.typeName.localeCompare(s2.employeeType.typeName));

  const teamView: TeamView = {
    teamName: team.teamName,
    spots: sortedSpots
  }
  return teamView;
};

export const extractAssignedUsersFromOpDayDetail = (opDayDetail: OpDayDetailDto): OpDayDetailUserProfileDto[] => {
  const users: OpDayDetailUserProfileDto[] = []
  opDayDetail.groups.forEach(g => users.push(...g.users));
  return users;
};

export const extractRequiredTeamsFromOpDayDetail = (opDayDetail: OpDayDetailDto): TeamDto[] => {
  const requiredTeams: TeamDto[] = [];
  opDayDetail.requiredOperationDayTeams.forEach(opDayTeam => {
    for (let i = 0; i < opDayTeam.requiredTeamCount; i++) {
      requiredTeams.push(opDayTeam.team);
    }
  });
  return requiredTeams;
};
