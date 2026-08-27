import type {
  OpDayDetailDto,
  OpDayDetailUserProfileDto,
  TeamDto,
  TeamView
} from "../../service/service-types";
import {
  countTeamViewSpot,
  extractAssignedUsersFromOpDayDetail,
  extractRequiredTeamsFromOpDayDetail,
  putUsersInTeamViewSpots,
  teamsToTeamViews
} from "./dashboardServices";
import "./DashboardTeams.css"

interface Props {
  opDayDetail: OpDayDetailDto,
}

export const DashboardTeams: React.FC<Props> = ({ opDayDetail }) => {
  if (!opDayDetail.requiredOperationDayTeams || opDayDetail.requiredOperationDayTeams.length < 1) {
    return <></>;
  }

  const usersToPutInTeamViewSpots: OpDayDetailUserProfileDto[] = extractAssignedUsersFromOpDayDetail(opDayDetail);
  const requiredTeams: TeamDto[] = extractRequiredTeamsFromOpDayDetail(opDayDetail);
  const requiredTeamViews: TeamView[] = teamsToTeamViews(requiredTeams);

  const placedUserCount = putUsersInTeamViewSpots(requiredTeamViews, usersToPutInTeamViewSpots);

  const totalRequired = countTeamViewSpot(requiredTeamViews);

  console.log(placedUserCount);

  return (
    <div>
      <h3>Teams</h3>
      <div>{placedUserCount}/{totalRequired}</div>

      {/* Assigned Users */}
      {requiredTeamViews.map((rtv, index) => (
        <div key={index} style={{ border: "1px solid gray" }}>
          <h4>{rtv.teamName}</h4>
          {rtv.spots.map((stv, i) => (
            <div key={i}>
              <div>
                {stv.employeeType.typeName}
              </div>
              {!stv.user && (
                <div>_</div>
              )}

              {stv.user && (
                <div>
                  {stv.user.firstName} {stv.user.lastName}
                  (
                  {stv.user.types.map(ut => (
                    <span key={ut.id}>{ut.typeName},</span>
                  ))}
                  )
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {/* Extra users */}
      {usersToPutInTeamViewSpots && usersToPutInTeamViewSpots.length > 0 && (
        <div style={{ border: "1px solid gray" }}>
          <h4>Extra Users ({usersToPutInTeamViewSpots.length})</h4>
          {usersToPutInTeamViewSpots.map(u => (
            <div>
              {u.firstName} {u.lastName}
              (
              {u.types.map(ut => (
                <span key={ut.id}>{ut.typeName},</span>
              ))}
              )
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

