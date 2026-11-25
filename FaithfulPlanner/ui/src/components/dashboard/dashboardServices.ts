import type {
  OpDayDetailDto,
  OpDayDetailUserProfileDto,
  OperationDayTeamDto,
  TeamViewSpot,
  TeamView
} from "../../service/service-types";

/** Creates one team view per team instance (requiredTeamCount) with one spot per required employee type. */
export const teamsToTeamViews = (requiredOperationDayTeams: OperationDayTeamDto[]): TeamView[] => {
  const teamViews: TeamView[] = [];
  requiredOperationDayTeams.forEach(odt => {
    for (let teamInstanceNo = 1; teamInstanceNo <= odt.requiredTeamCount; teamInstanceNo++) {
      const teamId = odt.team.id ?? 0;
      const spots: TeamViewSpot[] = [];
      odt.team.teamEmployeeTypes.forEach(tet => {
        for (let i = 0; i < tet.requiredEmployeeTypeCount; i++) {
          spots.push({
            teamId,
            teamInstanceNo,
            employeeTypeId: tet.employeeType.id ?? 0,
            employeeType: tet.employeeType
          });
        }
      });
      teamViews.push({
        teamId,
        teamName: odt.team.teamName,
        teamInstanceNo,
        spots: spots.sort((s1, s2) => s1.employeeType.typeName.localeCompare(s2.employeeType.typeName))
      });
    }
  });
  return teamViews.sort((tv1, tv2) =>
    tv1.teamName.localeCompare(tv2.teamName) || tv1.teamInstanceNo - tv2.teamInstanceNo);
};

export const extractAssignedUsersFromOpDayDetail = (opDayDetail: OpDayDetailDto): OpDayDetailUserProfileDto[] => {
  const users: OpDayDetailUserProfileDto[] = []
  opDayDetail.groups.forEach(g => users.push(...g.users));
  return users;
};

/**
 * Places each assigned user in the spot saved for them (team, team instance and employee type).
 * Returns the users that do not match any spot.
 */
export const putUsersInTeamViewSpots = (teamViews: TeamView[], users: OpDayDetailUserProfileDto[]): OpDayDetailUserProfileDto[] => {
  const unplacedUsers: OpDayDetailUserProfileDto[] = [];
  users.forEach(user => {
    const assignment = user.assignment;
    const spot = teamViews
      .flatMap(tv => tv.spots)
      .find(s => !s.user
        && assignment !== undefined
        && s.teamId === assignment.teamId
        && s.teamInstanceNo === assignment.teamInstanceNo
        && s.employeeTypeId === assignment.employeeTypeId);
    if (spot) {
      spot.user = user;
    } else {
      unplacedUsers.push(user);
    }
  });
  return unplacedUsers;
};

export const countTeamViewSpot = (teamViews: TeamView[]): number => teamViews
  .map(t => t.spots.length)
  .reduce((total, spotLength) => total + spotLength, 0);

/** An open spot accepts a user when the user holds the spot's employee type. */
export const canDropUserOnSpot = (user: OpDayDetailUserProfileDto, spot: TeamViewSpot): boolean =>
  !spot.user && user.types.some(t => t.id === spot.employeeTypeId);
