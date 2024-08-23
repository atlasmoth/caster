package http

import (
	"github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/customer"
	"github.com/stripe/stripe-go/v79/subscription"
)

type Gateway struct {
}

func New() *Gateway {
	return &Gateway{}
}

func (g *Gateway) CreateCustomer(email string) (*stripe.Customer, error) {

	params := &stripe.CustomerParams{
		Email: stripe.String(email),
	}
	result, err := customer.New(params)
	if err != nil {
		return nil, err
	}
	return result, err
}

func (g *Gateway) CreateSubscription(email string) (*stripe.Subscription, error) {

	customer, err := g.CreateCustomer(email)
	if err != nil {
		return nil, err
	}
	params := &stripe.SubscriptionParams{
		Customer: &customer.ID,
		Items: []*stripe.SubscriptionItemsParams{
			{
				Price: stripe.String("price_1Pr1bfE5bGjCBEBndwRCgT5K"),
			},
		},
		PaymentBehavior: stripe.String("default_incomplete"),
		PaymentSettings: &stripe.SubscriptionPaymentSettingsParams{
			SaveDefaultPaymentMethod: stripe.String("on_subscription"),
		},
		Metadata:  map[string]string{
			"user_id" : email,
		},
	}
	params.AddExpand("latest_invoice.payment_intent")
	result, err := subscription.New(params)
	if err != nil {
		return nil, err
	}

	return result, nil

}
