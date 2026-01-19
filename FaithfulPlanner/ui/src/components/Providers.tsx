import { UnAuthRedirect } from "./auth/UnAuthRedirect";
import { ScreenHeader } from "./common/ScreenHeader";

export default function Providers() {
  return (
    <div id="providers">
      <UnAuthRedirect/>
      <ScreenHeader screenName="Provider Management"> 
        <button className="btn btnSecondary" data-onclick="switchScreen('org-selection')">Switch Organization</button>
        <button className="btn btnPrimary" data-onclick="openModal('addProviderModal')">+ Add Provider</button>
      </ScreenHeader>

      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Contact</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Sarah Johnson</td>
              <td>General Medicine</td>
              <td>sarah@clinic.org</td>
              <td>Weekends</td>
              <td><span className="badge badgeSuccess">Available</span></td>
              <td>
                <button className="actionBtn actionBtnEdit">Edit</button>
                <button className="actionBtn actionBtnDelete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Dr. Michael Chen</td>
              <td>Pediatrics</td>
              <td>michael@clinic.org</td>
              <td>Saturdays</td>
              <td><span className="badge badgeSuccess">Available</span></td>
              <td>
                <button className="actionBtn actionBtnEdit">Edit</button>
                <button className="actionBtn actionBtnDelete">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Dr. Patricia Williams</td>
              <td>Cardiology</td>
              <td>patricia@clinic.org</td>
              <td>By Request</td>
              <td><span className="badge badgeWarning">Limited</span></td>
              <td>
                <button className="actionBtn actionBtnEdit">Edit</button>
                <button className="actionBtn actionBtnDelete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}