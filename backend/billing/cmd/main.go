package main

import (
	"os"

	billing "github.com/atlasmoth/caster/backend/billing/internal/controller"
	stripeGateway "github.com/atlasmoth/caster/backend/billing/internal/gateway/stripe/http"

	// kratos "github.com/atlasmoth/caster/backend/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v79"
)

func main() {
	stripeApiKey := os.Getenv("STRIPE_API_KEY")
	stripe.Key = stripeApiKey
	stripeGatewayForController := stripeGateway.New()
	ctrl := billing.New(stripeGatewayForController)

	router := gin.Default()
	// k := kratos.NewMiddleware("http://caster_kratos:4433")
	// router.Use(k.Session())
	router.POST("/users/subscription", ctrl.CreateSubscription)
	router.POST("/stripe/webhook", ctrl.HandleStripeWebhook)
	router.Run(":8084")
}
