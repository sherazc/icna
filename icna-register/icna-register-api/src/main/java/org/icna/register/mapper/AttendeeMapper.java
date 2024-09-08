package org.icna.register.mapper;

import org.icna.register.dto.AttendeeDto;
import org.icna.register.entity.event.Attendee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {EventProgramMapper.class})
public interface AttendeeMapper {
    @Mapping(target = "registration", ignore = true)
    @Mapping(target = "eventPrograms", ignore = true)
    Attendee dtoToBean(AttendeeDto dto);

    @Mapping(target = "eventId", source = "registration.event.id")
    AttendeeDto beanToDto(Attendee bean);
}
