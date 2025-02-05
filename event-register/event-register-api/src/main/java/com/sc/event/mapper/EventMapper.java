package com.sc.event.mapper;

import com.sc.event.dto.EventDto;
import com.sc.event.entity.event.Event;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventMapper {
    EventDto beanToDto(Event bean);

    Event dtoToBean(EventDto dto);
}
