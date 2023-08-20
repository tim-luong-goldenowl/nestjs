import Stripe from "stripe"

export type CreateCustomerCardResponseType = {
    stripeCustomerId?: string
    customerCard?: Stripe.Response<Stripe.CustomerSource>
}