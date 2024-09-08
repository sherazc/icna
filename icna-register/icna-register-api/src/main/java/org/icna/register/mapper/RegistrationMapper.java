package org.icna.register.mapper;

import org.icna.register.dto.RegistrationDto;
import org.icna.register.entity.event.Registration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserProfileMapper.class})
public interface RegistrationMapper {
    RegistrationDto beanToDto(Registration bean);
}