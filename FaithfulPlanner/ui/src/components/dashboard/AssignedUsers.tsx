import type { OpDayDetailEmployeeGroupDto } from "../../service/service-types";

interface Props {
  companyId: number,
  group: OpDayDetailEmployeeGroupDto
}

export const AssignedUsers: React.FC<Props> = ({ companyId, group }) => {
  console.log("Working", companyId)
  return (
    <div className="detailSection">
      <h4 className="detailSectionTitle">Assigned {group.groupName}</h4>
      <div className="cardStat">
        <span className="cardStatLabel">Total Assigned</span>
        <span className="cardStatValue" id="detail-providers-count">{group.users.length}</span>
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
  );
}