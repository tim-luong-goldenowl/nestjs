export type CreateConnectedAccountResponse = {
    success: boolean
    onboardingLink?: string
    connectedAccountId?: string
}

export type CreateConnectedAccountOptions = {
    returnUrl?: string
}