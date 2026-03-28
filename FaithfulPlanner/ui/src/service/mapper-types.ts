import { isoToDayOfWeek, isoToMonthDayYear } from "./DateService";
import { defaultOpDayDetailDto, type OpDayDetailDto, type OperationDayDto } from "./service-types";
import { touchString } from "./utilities";

export const operationDayDtoToOpDayDetailDto = (operationDay: OperationDayDto): OpDayDetailDto => {
  const opDayDetail = defaultOpDayDetailDto();
  opDayDetail.id = operationDay.id
  opDayDetail.companyId = operationDay.companyId
  opDayDetail.notes = operationDay.notes
  opDayDetail.serviceDateString = touchString(operationDay.serviceDateString)
  opDayDetail.serviceDateFormatted = isoToMonthDayYear(opDayDetail.serviceDateString);
  opDayDetail.serviceDateDayOfWeek = isoToDayOfWeek(opDayDetail.serviceDateString);

  return opDayDetail;
}