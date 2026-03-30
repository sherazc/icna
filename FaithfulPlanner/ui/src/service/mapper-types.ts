import { isoToDayOfWeek, isoToMonthDayYear } from "./DateService";
import { defaultOpDayDetailDto, defaultOperationDayDto, type EmployeeGroupDto, type OpDayDetailDto, type OperationDayDto } from "./service-types";
import { touchNumber, touchString } from "./utilities";


// NOTE: Users are empty
// Used only when new OperationDay is created
export const operationDayDtoToOpDayDetailDto = (operationDay: OperationDayDto, employeeGroups: EmployeeGroupDto[]): OpDayDetailDto => {
  const opDayDetail = defaultOpDayDetailDto();
  opDayDetail.id = operationDay.id
  opDayDetail.companyId = operationDay.companyId
  opDayDetail.notes = operationDay.notes
  opDayDetail.serviceDateString = touchString(operationDay.serviceDateString)
  opDayDetail.serviceDateFormatted = isoToMonthDayYear(opDayDetail.serviceDateString);
  opDayDetail.serviceDateDayOfWeek = isoToDayOfWeek(opDayDetail.serviceDateString);

  employeeGroups.forEach(eg => {
    opDayDetail.groups.push({
      id: touchNumber(eg.id),
      groupName: eg.groupName,
      users: []
    })
  });
  return opDayDetail;
};

export const opDayDetailDtoToOperationDayDto = (opDayDetail: OpDayDetailDto): OperationDayDto => {
  const operationDay: OperationDayDto = defaultOperationDayDto();
  operationDay.id = opDayDetail.id
  operationDay.companyId = opDayDetail.companyId
  operationDay.notes = opDayDetail.notes
  operationDay.serviceDateString = touchString(opDayDetail.serviceDateString)
  return operationDay;
};
