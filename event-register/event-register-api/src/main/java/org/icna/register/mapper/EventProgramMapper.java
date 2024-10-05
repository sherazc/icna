package org.event.register.mapper;

import org.event.register.dto.EventProgramDto;
import org.event.register.entity.event.EventProgram;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EventProgramMapper {
    @Mapping(source = "event.id", target = "eventId")
    EventProgramDto beanToDto(EventProgram bean);
    EventProgram dtoToBean(EventProgramDto dto);
}
