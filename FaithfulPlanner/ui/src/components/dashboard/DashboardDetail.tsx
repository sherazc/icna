import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/context";
import type { OpDayDetailDto, OpDayDetailEmployeeGroupDto } from "../../service/service-types";
import { touchNumber } from "../../service/utilities";
import { AssignedUsers } from "./AssignedUsers";

interface Props { }

export const DashboardDetail: React.FC<Props> = () => {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [opDayDetails, setOpDayDetails] = useState<OpDayDetailDto[]>([]);
  const [opDayDetailSelected, setOpDayDetailSelected] = useState<number>(-1);

  const loadData = async (companyId: number) => {
    const afterDateString = "2025-01-01";
    const beforeDateString = "2027-01-01";

    const opDayDetailsResponse = await clinicApis.opDayDetailFind(companyId, beforeDateString, afterDateString);
    setOpDayDetails(opDayDetailsResponse)
  }

  const getSelectedDetail = (index: number): OpDayDetailDto | undefined => {
    if (index > -1 && index < opDayDetails.length) {
      return opDayDetails[index];
    }
  }

  useEffect(() => {
    loadData(touchNumber(authUserToken.companyId));
  }, [authUserToken]);

  return (<>
    <div className="tableContainer">

      {opDayDetails.length < 1 && "No Data"}

      {opDayDetails.length > 0 &&
        // OpDayDetails grid table
        <div className="tableScroll">
          <table>
            <thead>
              <tr>
                <th>Clinic Date</th>

                {opDayDetails[0].groups && opDayDetails[0].groups.map((group) => (
                  <th key={group.id}>{`${group.groupName} Assigned`}</th>
                ))}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {opDayDetails.map((opDayDetail, index) => (
                <tr key={opDayDetail.id} onClick={() => setOpDayDetailSelected(index)}>
                  <td>
                    {opDayDetail.serviceDateDayOfWeek}
                    <br />
                    {opDayDetail.serviceDateFormatted}
                  </td>

                  {opDayDetail.groups && opDayDetail.groups.map((group) => (
                    <td key={group.id}>
                      {group.users.length}
                      {group.users.length > 0 &&
                        <small className="smallText">(
                          {group.users.map((u => `${u.firstName} ${u.lastName}`)).join(", ")}
                          )</small>
                      }
                    </td>
                  ))}
                  <td><span className="badge badgeSuccess">Scheduled</span></td>
                  <td>
                    <button className="actionBtn actionBtnEdit" data-onclick="event.stopPropagation(); openModal('editClinicModal')">Edit</button>
                    <button className="actionBtn actionBtnDelete" data-onclick="event.stopPropagation()">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
      }

    </div>

    {/* <!-- Day Details --> */}
    <div className="card clinicDayDetails">
      <div className="flex flex-start gap-1fullWidth">
        <h3 id="selected-clinic-date" className="m-fullWidth">
          Day Details: {getSelectedDetail(opDayDetailSelected)?.serviceDateDayOfWeek} {getSelectedDetail(opDayDetailSelected)?.serviceDateFormatted}
        </h3>
        <span id="selected-clinic-status" className="badge badgeSuccess hidden"></span>
      </div>

      <div className="detailsGrid">
        {getSelectedDetail(opDayDetailSelected)?.groups.map(g =>
          <AssignedUsers
            key={g.id}
            companyId={touchNumber(opDayDetails[opDayDetailSelected].companyId)}
            group={g} />)}
      </div>
    </div>
  </>);
}