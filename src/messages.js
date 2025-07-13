export const appWriteErrors = [
    {
        error: "Rate limit for the current endpoint has been exceeded. Please try again after some time.",
        message: "Please try again after some time."
    },
    {
        error: "A user with the same id, email, or phone already exists in this project.",
        message: "email or username already exists"
    },
    {
        error: "Creation of a session is prohibited when a session is active.",
        message: "Please logout and login again"
    },
    {
        error: `Missing required parameter: "email"`,
        message: "Please enter your email"
    },
    {
        error: "Network request failed",
        message: "Check your internet connection"
    }
]

export const checkAppWriteError = (errMsg) => {
    if (!errMsg) return ""
    const error = appWriteErrors?.map((errorObject) => {
        if (errMsg?.includes(errorObject?.error)) {
            return errorObject?.message
        }
    }).filter(Boolean)
    console.log(error)
    return error?.length > 0 ? error[0] : "Something went wrong"
}




