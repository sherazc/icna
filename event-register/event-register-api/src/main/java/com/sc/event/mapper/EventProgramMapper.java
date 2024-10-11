package com.sc.event.mapper;

import com.sc.event.dto.EventProgramDto;
import com.sc.event.entity.event.EventProgram;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EventProgramMapper {
    @Mapping(source = "event.id", target = "eventId")
    EventProgramDto beanToDto(EventProgram bean);
    EventProgram dtoToBean(EventProgramDto dto);
}
