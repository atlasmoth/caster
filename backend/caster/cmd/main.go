package main

import (
	"fmt"
	"os"

	feed "github.com/atlasmoth/caster/backend/caster/internal/controller"
	authGateway "github.com/atlasmoth/caster/backend/caster/internal/gateway/auth/http"
	billingGateway "github.com/atlasmoth/caster/backend/caster/internal/gateway/billing/http"
	kratos "github.com/atlasmoth/caster/backend/middleware"
	openapi "github.com/atlasmoth/go_neynar_sdk"
	"github.com/gin-gonic/gin"
)

func main() {
	neynarApiKey := os.Getenv("NEYNAR_API_KEY")
	neynarClient := openapi.NewAPIClient(openapi.NewConfiguration())
	billingGateway := billingGateway.New()
	authGateway := authGateway.New()
	ctrl := feed.New(billingGateway, authGateway, &neynarApiKey, neynarClient)
	fmt.Println(ctrl)
	router := gin.Default()
	k := kratos.NewMiddleware("http://caster_kratos:4433")
	authorized := router.Group("/user")
	authorized.Use(k.Session())
	{

	}
	router.Run(":8083")
}
