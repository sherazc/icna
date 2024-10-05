package org.event.register.mapper;

import org.event.register.dto.AttendeeDto;
import org.event.register.entity.event.Attendee;
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
