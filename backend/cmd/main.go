package main

import (
	"context"
	"database/sql"
	"log"
	"os"
	"time"

	billing "github.com/atlasmoth/caster/backend/internal/controller/billing"
	"github.com/atlasmoth/caster/backend/internal/data"
	stripeGateway "github.com/atlasmoth/caster/backend/internal/gateway/stripe/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/stripe/stripe-go/v79"
)

type config struct {
	db struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  string
	}
}

func main() {
	var cfg config
	cfg.db.dsn = os.Getenv("DSN")
	db, err := openDB(cfg)

	if err != nil {
		log.Fatalln(err, nil)
	}
	stripeApiKey := os.Getenv("STRIPE_API_KEY")
	stripe.Key = stripeApiKey
	stripeGatewayForController := stripeGateway.New()
	models := data.NewModels(db)
	ctrl := billing.New(stripeGatewayForController, models)

	router := gin.Default()
	router.Use(CORSMiddleware())
	router.GET("/users/redirect", ctrl.Redirect)
	router.POST("/users/checkout", ctrl.CreateCheckoutSession)
	router.GET("/users/validate", ctrl.SubscriptionValidator)
	router.POST("/users/subscription", ctrl.CreateSubscription)
	router.POST("/stripe/webhook", ctrl.HandleStripeWebhook)
	router.GET("/users/whoami", ctrl.WhoAmI)
	router.Run(":8084")
}

func openDB(cfg config) (*sql.DB, error) {

	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	duration, err := time.ParseDuration("15m")
	if err != nil {
		return nil, err
	}
	// Set the maximum idle timeout.
	db.SetConnMaxIdleTime(duration)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
