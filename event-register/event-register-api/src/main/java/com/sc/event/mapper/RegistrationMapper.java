package com.sc.event.mapper;

import com.sc.event.dto.RegistrationDto;
import com.sc.event.entity.event.Registration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserProfileMapper.class})
public interface RegistrationMapper {
    RegistrationDto beanToDto(Registration bean);
}