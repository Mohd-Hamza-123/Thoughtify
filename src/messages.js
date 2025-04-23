const appWriteErrors = [
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
    }
]

export const checkAppWriteError = (errorMessage) => {
    console.log(errorMessage)
    
    const error = appWriteErrors?.map((errorObject) => {
        if (errorMessage?.includes(errorObject?.error)) {
            return errorObject?.message
        }
    }).filter(Boolean)

    return error?.length > 0 ? error[0] : "Something went wrong"
}




