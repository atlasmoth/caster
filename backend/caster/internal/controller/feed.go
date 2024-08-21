package feed

import openapi "github.com/atlasmoth/go_neynar_sdk"

type billingGateway interface {
}

type authGateway interface {
}

type Controller struct {
	billingGateway billingGateway
	authGateway    authGateway
	apiKey         *string
	neynarClient   *openapi.APIClient
}

func New(billingGateway billingGateway, authGateway authGateway, apiKey *string, neynayClient *openapi.APIClient) *Controller {
	return &Controller{billingGateway, authGateway, apiKey, neynayClient}
}
