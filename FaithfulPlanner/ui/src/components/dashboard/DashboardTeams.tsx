import type { OpDayDetailDto } from "../../service/service-types";

interface Props {
  opDayDetail: OpDayDetailDto,
}

export const DashboardTeams:React.FC<Props> = ({opDayDetail: OpDayDetailDto}) => {

  console.log(OpDayDetailDto)

  return (
    <div>
      Dashboard Teams
    </div>
  );
}

