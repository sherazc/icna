package org.event.register.mapper;

import org.event.register.dto.UserProfileDto;
import org.event.register.entity.auth.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
interface UserProfileMapper {

    @Mapping(target = "eventId", source = "event.id")
    @Mapping(target = "userPassword", ignore = true)
    UserProfileDto beanToDto(UserProfile bean);
}