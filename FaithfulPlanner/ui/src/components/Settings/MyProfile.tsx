
export const MyProfile = () => {
  return (
    <div className="card">
      <h3>My Profile</h3>
      <div className="formGroup">
        <label htmlFor="email">Email</label>
        <input id="email" type="email"
        //  onChange={onChangeText}
          // value={modalEmployee.email} 
          />
        {/* <ErrorField errors={modalEmployeeErrors} fieldName="email" /> */}
      </div>

      <div className="formGroup">
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="text"
          // onChange={onChangeText}
          // value={modalEmployee.firstName}
        />
        {/* <ErrorField errors={modalEmployeeErrors} fieldName="firstName" /> */}
      </div>
      <div className="formGroup">
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" type="text" 
        // onChange={onChangeText}
        //  value={modalEmployee.lastName} 
        />
        {/* <ErrorField errors={modalEmployeeErrors} fieldName="lastName" /> */}
      </div>
      <div className="formGroup">
        <label htmlFor="phoneNumber">Phone Number</label>
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