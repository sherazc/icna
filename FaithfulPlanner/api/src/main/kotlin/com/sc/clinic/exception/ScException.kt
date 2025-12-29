package com.sc.clinic.exception

import java.lang.RuntimeException

open class ScException : RuntimeException {
    constructor(message: String) : super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
    constructor(cause: Throwable) : super(cause)
}

class ScBadRequestException: ScException {
    constructor(message: String): super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
}

class CompanyNotFoundException: ScException {
    constructor(companyId: Long?): super("Company not found. $companyId")
    constructor(message: String): super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
}

class UserProfileNotFoundException: ScException {
    constructor(userProfileId: Long?): super("User Profile not found. $userProfileId")
    constructor(message: String): super(message)
    constructor(message: String, cause: Throwable) : super(message, cause)
}
