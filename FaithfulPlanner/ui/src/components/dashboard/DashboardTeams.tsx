import type { 
  OpDayDetailDto, 
  OpDayDetailUserProfileDto, 
  TeamDto, 
  TeamView 
} from "../../service/service-types";
import { 
  extractAssignedUsersFromOpDayDetail, 
  extractRequiredTeamsFromOpDayDetail, 
  teamToTeamView 
} from "./dashboardServices";

interface Props {
  opDayDetail: OpDayDetailDto,
}

export const DashboardTeams: React.FC<Props> = ({ opDayDetail }) => {
  if (!opDayDetail.requiredOperationDayTeams || opDayDetail.requiredOperationDayTeams.length < 1) {
    return <></>;
  }

  const usersToPutInTeamViewSpots: OpDayDetailUserProfileDto[] = extractAssignedUsersFromOpDayDetail(opDayDetail);
  const requiredTeams: TeamDto[] = extractRequiredTeamsFromOpDayDetail(opDayDetail);
  const requiredTeamViews: TeamView[] = requiredTeams.map(t => teamToTeamView(t));


  console.log(requiredTeamViews);

  return (
    <div>
      <h3>Teams</h3>
    </div>
  );
}

