CompanyDto
{
  id: number,
  employeeGroups: EmployeeGroupDto[]
}

EmployeeGroupDto
{
  id: number,
  groupName: string,
  employeeTypes: EmployeeTypeDto[]
}

EmployeeTypeDto {
  id: number,
  typeName: string
}


# Requirement
Create a tab for each employee-group

When user login check if employee-groups are present, 

Then navigate user to company view. Or else navigate user to Dashboard screen

On Company view Screen if employee-groups are not available then show message to create employee-groups

In company screen ADMIN and MASTER can CUD employee-group

In company screen BASIC_USER user can view employee-group


## Employee Group
Get employee group
Get /employee-group/companyId/{companyId}
response: EmployeeGroupDto[]

