import type { OpDayDetailEmployeeGroupDto } from "../../service/service-types";

interface Props {
  companyId: number,
  group: OpDayDetailEmployeeGroupDto
}

export const AssignedUsers: React.FC<Props> = ({ group }) => {
  return (
    <div className="detailSection">
      <h4 className="detailSectionTitle">Assigned {group.groupName}</h4>
      <div className="cardStat">
        <span className="cardStatLabel">Total Assigned</span>
        <span className="cardStatValue" id="detail-providers-count">{group.users.length}</span>
      </div>
      <div className="mt-15 searchWrapper">
        <div className="searchInputContainer">
          <input type="text" id="provider-search" placeholder="Search and add..." className="searchInput" />
          <div id="provider-dropdown" className="searchDropdown"></div>
        </div>
        <button type="button" className="dropdownToggleBtn" data-onclick="toggleAllProviders()" title="Show all">▼</button>
      </div>
      <div>
        <h5 className="cardStatLabel mt-15 mb-1fullWidth">Assigned List</h5>
        <ul className="personList" id="detail-providers-list">
          {group.users.length < 1 && (
            <li className="personItem">
              <span className="personName">No one assigned</span>
            </li>
          )}
          {group.users.length > 0 && group.users.map(u => (
            <li className="personItem" key={u.id}>
              <div className="flex flex-start gap-4 flex-1">
                <span className="personName">{u.firstName} {u.lastName}</span>
                <span className="personRole">
                  {u.types.map(t => t.typeName).join(", ")}
                </span>
              </div>
              <button type="button" className="personRemoveBtn" title="Remove">✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}