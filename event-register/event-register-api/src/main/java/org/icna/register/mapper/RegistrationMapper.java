package org.event.register.mapper;

import org.event.register.dto.RegistrationDto;
import org.event.register.entity.event.Registration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserProfileMapper.class})
public interface RegistrationMapper {
    RegistrationDto beanToDto(Registration bean);
}