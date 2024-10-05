package org.icna.register.mapper;

import org.icna.register.dto.UserProfileDto;
import org.icna.register.entity.auth.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
interface UserProfileMapper {

    @Mapping(target = "eventId", source = "event.id")
    @Mapping(target = "userPassword", ignore = true)
    UserProfileDto beanToDto(UserProfile bean);
}