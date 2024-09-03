package feed

import openapi "github.com/atlasmoth/go_neynar_sdk"

type Controller struct {
	apiKey       *string
	neynarClient *openapi.APIClient
}

func New(apiKey *string, neynayClient *openapi.APIClient) *Controller {
	return &Controller{apiKey, neynayClient}
}
