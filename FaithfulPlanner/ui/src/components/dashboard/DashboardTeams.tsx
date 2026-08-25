import type { OpDayDetailDto, OpDayDetailUserProfileDto, TeamDto } from "../../service/service-types";

interface Props {
  opDayDetail: OpDayDetailDto,
}

export const DashboardTeams:React.FC<Props> = ({opDayDetail}) => {
  if (!opDayDetail.requiredOperationDayTeams || opDayDetail.requiredOperationDayTeams.length < 1) {
    return <></>;
  }

  const users: OpDayDetailUserProfileDto[] = []
  opDayDetail.groups.forEach(g => users.push(...g.users));
  const teams: TeamDto[] = []
  opDayDetail.requiredOperationDayTeams.forEach(opDayTeam => {
    for(let i=0; i< opDayTeam.requiredTeamCount; i++) {
      teams.push(opDayTeam.team);
    }
  });

  console.log(teams)

  return (
    <div>
      <h3>Teams</h3>
    </div>
  );
}

