# Requirement

## ui/src/components/dashboard/Dashboard.tsx

I need to update this file

It has {/* New and Edit Modal */}

Inside the modal's <form> add checkboxes

For now dont implement checkbox's checked logic

You will have to create groups of checkboxes

Each group will have a heading and 2 columns of checkboxes

there is a state
const [allGroupTypes, setAllGroupTypes] = useState<EmployeeGroupTypesDto[]>([]);

you will have to run nested loop. one on array of EmployeeGroupTypesDto

and sub loop on EmployeeGroupTypesDto.employeeTypes array


Do it the way it is done in buildColumns() function in ui/src/components/common/UserProfileForm.tsx

For now duplicate column styles of ui/src/components/common/UserProfileForm.css in ui/src/components/dashboard/Dashboard.css 

use EmployeeGroupTypesDto.groupName as the heading of checkboxes group