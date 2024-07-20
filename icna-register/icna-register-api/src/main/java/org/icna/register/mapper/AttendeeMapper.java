package org.icna.register.mapper;

import org.icna.register.dto.AttendeeDto;
import org.icna.register.dto.EventDto;
import org.icna.register.entity.Attendee;
import org.icna.register.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttendeeMapper {
    @Mapping(target = "registration", ignore = true)
    @Mapping(target = "eventPrograms", ignore = true)
    Attendee dtoToBean(AttendeeDto dto);
}
