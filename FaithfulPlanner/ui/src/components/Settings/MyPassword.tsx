
export const MyPassword = () => {
  return (
    <div className="card">
      <h3>My Password</h3>
      <div className="formGroup">
        <label htmlFor="firstName">Current Password</label>
        <input id="firstName" type="text"
          // onChange={onChangeText}
          // value={modalEmployee.firstName}
        />
        {/* <ErrorField errors={modalEmployeeErrors} fieldName="firstName" /> */}
      </div>
      <div className="formGroup">
        <label htmlFor="lastName">New Password</label>
        <input id="lastName" type="text" 
        // onChange={onChangeText}
        //  value={modalEmployee.lastName} 
        />
        {/* <ErrorField errors={modalEmployeeErrors} fieldName="lastName" /> */}
      </div>
      <div className="formGroup">
        <label htmlFor="phoneNumber">Confirm Password</label>
        <input id="phoneNumber" type="text" 
        // onChange={onChangeText}
        // value={modalEmployee.phoneNumber} 
        />
        {/* <ErrorField errors={modalEmployeeErrors} fieldName="phoneNumber" /> */}
      </div>

      <div>
        <button className="btn btnPrimary fullWidth marginTop15">Save</button>
      </div>
    </div>
  )
}