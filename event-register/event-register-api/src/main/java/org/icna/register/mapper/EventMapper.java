package org.event.register.mapper;

import org.event.register.dto.EventDto;
import org.event.register.entity.event.Event;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventMapper {
    EventDto beanToDto(Event bean);

    EventDto dtoToBean(EventDto dto);
}
