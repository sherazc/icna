CompanyDto
{
  employeeTypeGroups: EmployeeTypeGroupDto[]
}

EmployeeTypeGroupDto
{
  groupName: string,
  employeeTypes: EmployeeType[]
}

EmployeeType {
  
}



# Requirement.
create a tab for each employee-group-type

employee-group-type will have create, update, delete employees

Company View create crud of employee-group-type and employee-type




# Requirement Login
When user login check if employee-type-groups are present.
If they are not then take user to company view. 
On company view if user is ADMIN then show them 




# Requirement employee type



## Employee Type Controller
request
Get /employee-type/companyId/{companyId}
response
{
  typeName: string,
  employeeTypeGroup: string
}

request
Get /employee-type/companyId/{companyId}/group
response
string[]





