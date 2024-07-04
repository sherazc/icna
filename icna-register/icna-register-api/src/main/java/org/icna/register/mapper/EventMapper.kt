package org.icna.register.mapper

import org.icna.register.dto.EventDto
import org.icna.register.entity.Event
import org.mapstruct.Mapper

@Mapper(componentModel = "spring")
interface EventMapper {
    fun beanToDto(bean: Event): EventDto
    fun dtoToBean(dto: EventDto): EventDto
}