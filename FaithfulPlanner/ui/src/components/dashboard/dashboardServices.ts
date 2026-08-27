import type {
  OpDayDetailDto,
  OpDayDetailUserProfileDto,
  TeamViewSpot,
  TeamDto,
  TeamView
} from "../../service/service-types";

export const teamsToTeamViews = (teams: TeamDto[]): TeamView[] =>
  teams.map(t => teamToTeamView(t)).sort((tv1, tv2) => tv1.teamName.localeCompare(tv2.teamName));


const teamToTeamView = (team: TeamDto): TeamView => {
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

export const putUsersInTeamViewSpots = (teamViews: TeamView[], users: OpDayDetailUserProfileDto[]) => {
  teamViews.forEach(rtv => {
    rtv.spots.forEach(s => {
      const userIndex = users.findIndex(u => u.types.findIndex(t => t.id === s.employeeType.id) > -1);
      if (userIndex > -1) {
        const user:OpDayDetailUserProfileDto = users[userIndex];
        s.user = user;
        users.splice(userIndex, 1);
      }
    });
  });
};