package org.icna.register.mapper;

import org.icna.register.dto.EventProgramDto;
import org.icna.register.entity.EventProgram;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EventProgramMapper {
    EventProgramDto beanToDto(EventProgram bean);
    EventProgram dtoToBean(EventProgramDto dto);
}