package com.sc.event.mapper;

import com.sc.event.dto.UserProfileDto;
import com.sc.event.entity.auth.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
interface UserProfileMapper {

    @Mapping(target = "eventId", source = "event.id")
    @Mapping(target = "userPassword", ignore = true)
    UserProfileDto beanToDto(UserProfile bean);
}