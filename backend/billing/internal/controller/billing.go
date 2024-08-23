package billing

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/atlasmoth/caster/backend/billing/internal/data"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/webhook"
)

type StripeGateway interface {
	CreateCustomer(email string) (*stripe.Customer, error)
	CreateSubscription(email string) (*stripe.Subscription, error)
}

type Controller struct {
	stripeGateway StripeGateway
	models data.Models
}

func New(stripeGateway StripeGateway, models data.Models) *Controller {
	return &Controller{stripeGateway, models}
}

func (ctrl *Controller) CreateSubscription(c *gin.Context) {

	subscription, err := ctrl.stripeGateway.CreateSubscription("ebuka422@gmail.com")
	if err != nil {
		c.Status(http.StatusBadRequest)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    subscription,
	})

}

func (ctrl *Controller) HandleStripeWebhook(c *gin.Context) {

	b, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("ioutil.ReadAll: %v", err)
		return
	}

	event, err := webhook.ConstructEvent(b, c.GetHeader("Stripe-Signature"), os.Getenv("STRIPE_WEBHOOK_SECRET"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("webhook.ConstructEvent: %v", err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"received": true})

	switch event.Type {
	case "invoice.paid":
		{

			var invoice stripe.Invoice
			err := json.Unmarshal(event.Data.Raw, &invoice)
			if err != nil {
				fmt.Printf("error parsing webhook JSON: %v", err)
				return
			}
			ctrl.models.Users.Upsert(invoice.CustomerEmail,invoice.Subscription.ID,time.Unix(int64(invoice.Lines.Data[0].Period.End), 0).UTC())
			

			break
		}
	case "invoice.payment_failed":
		{
			// If the payment fails or the customer does not have a valid payment method,
			// an invoice.payment_failed event is sent, the subscription becomes past_due.
			// Use this webhook to notify your user that their payment has
			// failed and to retrieve new card details.
			break
		}

	case "customer.subscription.deleted":
		{
			// handle subscription canceled automatically based
			// upon your subscription settings. Or if the user cancels it.
			break
		}

	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}
