import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context";
import type { OpDayDetailDto, OpDayDetailUserProfileDto } from "../service/service-types";
import { touchNumber } from "../service/utilities";

interface Props { }

export const DashboardDetail: React.FC<Props> = () => {
  const [{ authUserToken, clinicApis }] = useContext(AppContext);
  const [opDayDetails, setOpDayDetails] = useState<OpDayDetailDto[]>([]);

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
                  <br/>
                  {opDayDetail.serviceDateFormatted}
                </td>
                
                {opDayDetail.groups && opDayDetail.groups.map((group) => (
                <td key={group.id}>
                  {group.users.length}
                  {group.users.length > 0 && 
                  <small className="smallText">(
                    {group.users.map((u => `${u.firstName} ${u.lastName}`)).join(", ") }
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
              )) }
            </tbody>
          </table>


        </div>
      }

    </div>

    {/* <!-- Clinic Day Details Section --> */}
    <div className="card clinicDayDetails">
      <div className="flex flex-start gap-1fullWidth">
        <h3 id="selected-clinic-date" className="m-fullWidth">Select a clinic date to view details</h3>
        <span id="selected-clinic-status" className="badge badgeSuccess hidden"></span>
      </div>

      <div className="detailsGrid">
        {/* <!-- Providers Details --> */}
        <div className="detailSection">
          <h4 className="detailSectionTitle">Assigned Providers</h4>
          <div className="cardStat">
            <span className="cardStatLabel">Total Assigned</span>
            <span className="cardStatValue" id="detail-providers-count">0</span>
          </div>
          <div className="mt-15 searchWrapper">
            <div className="searchInputContainer">
              <input type="text" id="provider-search" placeholder="Search and add providers..." className="searchInput" />
              <div id="provider-dropdown" className="searchDropdown"></div>
            </div>
            <button type="button" className="dropdownToggleBtn" data-onclick="toggleAllProviders()" title="Show all providers">▼</button>
          </div>
          <div>
            <h5 className="cardStatLabel mt-15 mb-1fullWidth">Provider List</h5>
            <ul className="personList" id="detail-providers-list">
              <li className="personItem">
                <span className="personName">No providers assigned</span>
              </li>
            </ul>
          </div>
        </div>

        {/* <!-- Volunteers Details --> */}
        <div className="detailSection">
          <h4 className="detailSectionTitle">Assigned Volunteers</h4>
          <div className="cardStat">
            <span className="cardStatLabel">Total Assigned</span>
            <span className="cardStatValue" id="detail-volunteers-count">0</span>
          </div>
          <div className="mt-15 searchWrapper">
            <div className="searchInputContainer">
              <input type="text" id="volunteer-search" placeholder="Search and add volunteers..." className="searchInput" />
              <div id="volunteer-dropdown" className="searchDropdown"></div>
            </div>
            <button type="button" className="dropdownToggleBtn" data-onclick="toggleAllVolunteers()" title="Show all volunteers">▼</button>
          </div>
          <div>
            <h5 className="cardStatLabel mt-15 mb-1fullWidth">Volunteer List</h5>
            <ul className="personList" id="detail-volunteers-list">
              <li className="personItem">
                <span className="personName">No volunteers assigned</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>);
}