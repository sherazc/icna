package org.icna.register.mapper;

import org.icna.register.dto.EventDto;
import org.icna.register.entity.Event;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventMapper {
    EventDto beanToDto(Event bean);

    EventDto dtoToBean(EventDto dto);
}
