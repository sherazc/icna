package com.sc.event.mapper;

import com.sc.event.entity.ui.Style;
import com.sc.event.service.model.StyleVariable;
import org.mapstruct.Mapper;

@Mapper
public interface StyleMapper {
    StyleVariable beanToDto(Style style);
    Style dtoToBean(StyleVariable styleDto);
}
