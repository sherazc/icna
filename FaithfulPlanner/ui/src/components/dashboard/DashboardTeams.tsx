import { useContext, useState } from "react";
import type {
  OpDayDetailDto,
  OpDayDetailUserProfileDto,
  TeamView,
  TeamViewSpot
} from "../../service/service-types";
import {
  canDropUserOnSpot,
  countTeamViewSpot,
  extractAssignedUsersFromOpDayDetail,
  putUsersInTeamViewSpots,
  teamsToTeamViews
} from "./dashboardServices";
import { AppContext } from "../../store/context";
import { isContainsAnyRoles } from "../../service/authentication-services";
import { touchNumber } from "../../service/utilities";
import "./DashboardTeams.css"

interface Props {
  opDayDetail: OpDayDetailDto,
  onMoveUser: (operationDayId: number, userProfileId: number, spot: TeamViewSpot) => Promise<void>,
}

export const DashboardTeams: React.FC<Props> = ({ opDayDetail, onMoveUser }) => {
  const [{ authUserToken }] = useContext(AppContext);
  const [draggedUser, setDraggedUser] = useState<OpDayDetailUserProfileDto | null>(null);
  const [dropTargetKey, setDropTargetKey] = useState<string | null>(null);
  const [moveError, setMoveError] = useState<string>("");

  if (!opDayDetail.requiredOperationDayTeams || opDayDetail.requiredOperationDayTeams.length < 1) {
    return <></>;
  }

  const canMove = isContainsAnyRoles(authUserToken, ["ADMIN", "MASTER"]);
  const extraUsers: OpDayDetailUserProfileDto[] = extractAssignedUsersFromOpDayDetail(opDayDetail);
  const requiredTeamViews: TeamView[] = teamsToTeamViews(opDayDetail.requiredOperationDayTeams);

  const unplacedUsers = putUsersInTeamViewSpots(requiredTeamViews, extraUsers);
  const totalRequired = countTeamViewSpot(requiredTeamViews);
  const placedUserCount = requiredTeamViews.flatMap(tv => tv.spots).filter(s => s.user).length;

  const isComplete = placedUserCount >= totalRequired;

  const spotKey = (spot: TeamViewSpot) => `${spot.teamId}-${spot.teamInstanceNo}-${spot.employeeTypeId}`;

  const onDragEnd = () => {
    setDraggedUser(null);
    setDropTargetKey(null);
  };

  const onDropOnSpot = async (spot: TeamViewSpot) => {
    const user = draggedUser;
    onDragEnd();
    if (!user || !canDropUserOnSpot(user, spot)) {
      return;
    }
    setMoveError("");
    try {
      await onMoveUser(touchNumber(opDayDetail.id), user.id, spot);
    } catch (error) {
      console.log(error);
      setMoveError(`Could not move ${user.firstName} ${user.lastName} to ${spot.employeeType.typeName} spot.`);
    }
  };

  return (
    <div className="teams">
      <div className="teamsHeader">
        <h3 className="teamsTitle">Teams</h3>
        <span className={`badge ${isComplete ? "badgeSuccess" : "badgeWarning"}`}>
          {placedUserCount}/{totalRequired} filled
        </span>
      </div>
      {moveError && <div className="errorMessage">{moveError}</div>}

      <div className="teamsGrid">
        {requiredTeamViews.map((rtv) => (
          <div className="teamCard" key={`${rtv.teamId}-${rtv.teamInstanceNo}`}>
            <h4 className="teamCardTitle">{rtv.teamName} #{rtv.teamInstanceNo}</h4>
            <ul className="spotList">
              {rtv.spots.map((stv, i) => {
                const user = stv.user;
                const isDropTarget = dropTargetKey === spotKey(stv) && draggedUser !== null && canDropUserOnSpot(draggedUser, stv);
                return (
                  <li className={`spot ${user ? "spotFilled" : "spotEmpty"} ${isDropTarget ? "spotDropTarget" : ""}`} key={i}
                    draggable={canMove && !!user}
                    title={canMove && user ? "Drag to an open spot with a matching type to move" : undefined}
                    onDragStart={() => user && setDraggedUser(user)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => {
                      if (draggedUser && canDropUserOnSpot(draggedUser, stv)) {
                        e.preventDefault();
                        setDropTargetKey(spotKey(stv));
                      }
                    }}
                    onDragLeave={() => setDropTargetKey(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      onDropOnSpot(stv);
                    }}>
                    <span className="spotIcon" aria-hidden="true">{user ? "✅" : "⭕"}</span>
                    <div className="spotBody">
                      <span className="spotType">{stv.employeeType.typeName}</span>
                      {user ? (
                        <span className="spotUser">
                          {user.firstName} {user.lastName}
                          <span className="spotRoles">
                            {user.types.map(ut => (
                              <span className="spotRole" key={ut.id}>{ut.typeName}</span>
                            ))}
                          </span>
                        </span>
                      ) : (
                        <span className="spotOpen">Open spot</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {unplacedUsers && unplacedUsers.length > 0 && (
          <div className="teamCard teamCardExtra">
            <h4 className="teamCardTitle">
              Extra Users
              <span className="badge badgePrimary">{unplacedUsers.length}</span>
            </h4>
            <ul className="spotList">
              {unplacedUsers.map(u => (
                <li className="spot spotExtra" key={u.id}
                  draggable={canMove}
                  title={canMove ? "Drag to an open spot with a matching type to place" : undefined}
                  onDragStart={() => setDraggedUser(u)}
                  onDragEnd={onDragEnd}>
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
