package org.event.register.dto

/**
 * Identify Logged-in user and registration's user.
 *
 * Could be the user who runs the application or basic user who has registered.
 */
class UserProfileDto(
    var id: Long?,
    var email: String,
    var userPassword: String?,
    var eventId: Long)