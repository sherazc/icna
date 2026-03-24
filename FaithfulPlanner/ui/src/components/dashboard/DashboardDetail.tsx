import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/context";
import type { OpDayDetailDto, OpDayDetailEmployeeGroupDto } from "../../service/service-types";
import { touchNumber } from "../../service/utilities";
import { AssignedUsers } from "./AssignedUsers";

interface Props { }

export const DashboardDetail: React.FC<Props> = () => {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [opDayDetails, setOpDayDetails] = useState<OpDayDetailDto[]>([]);
  const [opDayDetailSelected, setOpDayDetailSelected] = useState<number>(0);

  const loadData = async (companyId: number) => {
    const afterDateString = "2025-01-01";
    const beforeDateString = "2027-01-01";

    const opDayDetailsResponse = await clinicApis.opDayDetailFind(companyId, beforeDateString, afterDateString);
    setOpDayDetails(opDayDetailsResponse)
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

                {opDayDetails[0].groups && opDayDetails[0].groups.map((group) => (<>
                  <th>{`${group.groupName} Assigned`}</th>
                </>))}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {opDayDetails.map((opDayDetail) => (
                <tr key={opDayDetail.id} data-onclick="selectRow(this, 'Nov 30, 2025')">
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
        <h3 id="selected-clinic-date" className="m-fullWidth">Day Details</h3>
        <span id="selected-clinic-status" className="badge badgeSuccess hidden"></span>
      </div>


      <div className="detailsGrid">
        {opDayDetailSelected > -1 && opDayDetailSelected < opDayDetails.length
          && opDayDetails[opDayDetailSelected].groups.map((g, index) =>
            <AssignedUsers
              key={index}
              companyId={touchNumber(opDayDetails[opDayDetailSelected].companyId)}
              group={g} />)}
      </div>
    </div>
  </>);
}