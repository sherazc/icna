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

  const extraUsers: OpDayDetailUserProfileDto[] = extractAssignedUsersFromOpDayDetail(opDayDetail);
  const requiredTeams: TeamDto[] = extractRequiredTeamsFromOpDayDetail(opDayDetail);
  const requiredTeamViews: TeamView[] = teamsToTeamViews(requiredTeams);

  const placedUserCount = putUsersInTeamViewSpots(requiredTeamViews, extraUsers);
  const totalRequired = countTeamViewSpot(requiredTeamViews);

  const isComplete = placedUserCount >= totalRequired;

  return (
    <div className="teams">
      <div className="teamsHeader">
        <h3 className="teamsTitle">Teams</h3>
        <span className={`badge ${isComplete ? "badgeSuccess" : "badgeWarning"}`}>
          {placedUserCount}/{totalRequired} filled
        </span>
      </div>

      <div className="teamsGrid">
        {requiredTeamViews.map((rtv, index) => (
          <div className="teamCard" key={index}>
            <h4 className="teamCardTitle">{rtv.teamName}</h4>
            <ul className="spotList">
              {rtv.spots.map((stv, i) => (
                <li className={`spot ${stv.user ? "spotFilled" : "spotEmpty"}`} key={i}>
                  <span className="spotIcon" aria-hidden="true">{stv.user ? "✅" : "⭕"}</span>
                  <div className="spotBody">
                    <span className="spotType">{stv.employeeType.typeName}</span>
                    {stv.user ? (
                      <span className="spotUser">
                        {stv.user.firstName} {stv.user.lastName}
                        <span className="spotRoles">
                          {stv.user.types.map(ut => (
                            <span className="spotRole" key={ut.id}>{ut.typeName}</span>
                          ))}
                        </span>
                      </span>
                    ) : (
                      <span className="spotOpen">Open spot</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {extraUsers && extraUsers.length > 0 && (
          <div className="teamCard teamCardExtra">
            <h4 className="teamCardTitle">
              Extra Users
              <span className="badge badgePrimary">{extraUsers.length}</span>
            </h4>
            <ul className="spotList">
              {extraUsers.map(u => (
                <li className="spot spotExtra" key={u.id}>
                  <span className="spotIcon" aria-hidden="true">🙋</span>
                  <div className="spotBody">
                    <span className="spotUser">
                      {u.firstName} {u.lastName}
                      <span className="spotRoles">
                        {u.types.map(ut => (
                          <span className="spotRole" key={ut.id}>{ut.typeName}</span>
                        ))}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
