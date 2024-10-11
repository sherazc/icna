package com.sc.event.mapper;

import com.sc.event.dto.AttendeeDto;
import com.sc.event.entity.event.Attendee;
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
