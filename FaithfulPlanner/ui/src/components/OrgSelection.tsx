export default function OrgSelection() {
  return (
    <div id="org-selection">
      <div className="header">
        <h2>Select Organization</h2>
        <button className="btn btnLogout" data-onclick="switchScreen('login')">Logout</button>
      </div>

      <div className="dashboardGrid">
        <div className="card" data-onclick="selectOrganization('mercy-clinic')">
          <h3>Mercy Free Clinic</h3>
          <div className="cardStat">
            <span className="cardStatLabel">Role</span>
            <span className="cardStatValue">Admin</span>
          </div>
          <div className="cardStat">
            <span className="cardStatLabel">Active Providers</span>
            <span className="cardStatValue">12</span>
          </div>
          <div className="cardStat">
            <span className="cardStatLabel">Volunteers</span>
            <span className="cardStatValue">28</span>
          </div>
        </div>

        <div className="card" data-onclick="selectOrganization('hope-center')">
          <h3>Hope Community Center</h3>
          <div className="cardStat">
            <span className="cardStatLabel">Role</span>
            <span className="cardStatValue">Provider</span>
          </div>
          <div className="cardStat">
            <span className="cardStatLabel">Active Providers</span>
            <span className="cardStatValue">8</span>
          </div>
          <div className="cardStat">
            <span className="cardStatLabel">Volunteers</span>
            <span className="cardStatValue">15</span>
          </div>
        </div>

        <div className="card" data-onclick="selectOrganization('faith-health')">
          <h3>Faith & Health Alliance</h3>
          <div className="cardStat">
            <span className="cardStatLabel">Role</span>
            <span className="cardStatValue">Volunteer</span>
          </div>
          <div className="cardStat">
            <span className="cardStatLabel">Active Providers</span>
            <span className="cardStatValue">6</span>
          </div>
          <div className="cardStat">
            <span className="cardStatLabel">Volunteers</span>
            <span className="cardStatValue">22</span>
          </div>
        </div>
      </div>
    </div>
  );
}