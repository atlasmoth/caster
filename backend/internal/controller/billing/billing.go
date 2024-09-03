package billing

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/atlasmoth/caster/backend/internal/data"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/webhook"
)

type StripeGateway interface {
	CreateCustomer(email string) (*stripe.Customer, error)
	CreateSubscription(email string) (*stripe.Subscription, error)
	CreateCheckoutSession(email, successUrl, cancelUrl string) (*stripe.CheckoutSession, error)
}

type Controller struct {
	stripeGateway StripeGateway
	models        data.Models
}

func New(stripeGateway StripeGateway, models data.Models) *Controller {
	return &Controller{stripeGateway, models}
}

type CreateSubscriptionBody struct {
	Email string `json:"email" binding:"required"`
}

func (ctrl *Controller) CreateSubscription(c *gin.Context) {

	email, err := ctrl.validateKratosSession(c.Request)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	subscription, err := ctrl.stripeGateway.CreateSubscription(*email)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    subscription,
	})

}

type CreateCheckoutSessionBody struct {
	SuccessURL string `json:"successUrl" form:"successUrl" binding:"required"`
	CancelURL  string `json:"cancelUrl" form:"cancelUrl" binding:"required"`
}

func (ctrl *Controller) CreateCheckoutSession(c *gin.Context) {
	body := CreateCheckoutSessionBody{}
	if err := c.ShouldBindJSON(&body); err != nil {
		returnErrorResponse(c, err)
		return
	}
	email, err := ctrl.validateKratosSession(c.Request)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	subscription, err := ctrl.stripeGateway.CreateCheckoutSession(*email, body.SuccessURL, body.CancelURL)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    subscription,
	})

}
func returnErrorResponse(c *gin.Context, err error) {
	c.Status(http.StatusBadRequest)
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": err.Error(),
	})

}

func (ctrl *Controller) SubscriptionValidator(c *gin.Context) {

	email, err := ctrl.validateKratosSession(c.Request)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	user, err := ctrl.models.Users.GetSubscriptionByEmail(*email)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    user,
	})

}
func (ctrl *Controller) WhoAmI(c *gin.Context) {

	email, err := ctrl.validateKratosSession(c.Request)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}
	user, _ := ctrl.models.Users.GetSubscriptionByEmail(*email)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    user,
	})

}

func (ctrl *Controller) Redirect(c *gin.Context) {

	redirectURL := c.Query("to")
	sessionId := c.Query("session_id")

	http.Redirect(c.Writer, c.Request, redirectURL+"?session_id="+sessionId, http.StatusFound)

}

func (ctrl *Controller) HandleStripeWebhook(c *gin.Context) {

	b, err := io.ReadAll(c.Request.Body)
	if err != nil {
		returnErrorResponse(c, err)
		return
	}

	event, err := webhook.ConstructEvent(b, c.GetHeader("Stripe-Signature"), os.Getenv("STRIPE_WEBHOOK_SECRET"))

	if err != nil {
		returnErrorResponse(c, err)
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
			ctrl.models.Users.Upsert(invoice.CustomerEmail, invoice.Subscription.ID, time.Unix(int64(invoice.Lines.Data[0].Period.End), 0).UTC())

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

}

type SessionResponse struct {
	Identity struct {
		Traits struct {
			Email string `json:"email"`
		} `json:"traits"`
	} `json:"identity"`
}

func (ctrl *Controller) validateKratosSession(r *http.Request) (*string, error) {

	sessionToken := r.Header.Get("Authorization")

	if sessionToken == "" {
		return nil, errors.New("no session token found")
	}
	client := &http.Client{}
	req, err := http.NewRequest("GET", "http://caster_kratos:4433/sessions/whoami", nil)
	req.Header.Set("Authorization", sessionToken)
	req.Header.Set("Accept", "application/json")

	if err != nil {
		return nil, err
	}
	res, err := client.Do(req)

	if err != nil || res.StatusCode != http.StatusOK {
		return nil, err
	}

	defer res.Body.Close()

	var sessionBody SessionResponse

	err = json.NewDecoder(res.Body).Decode(&sessionBody)

	if err != nil {
		return nil, err
	}

	return &sessionBody.Identity.Traits.Email, nil
}
