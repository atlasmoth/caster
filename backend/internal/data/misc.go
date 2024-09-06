package data

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ReturnErrorResponse(c *gin.Context, err error) {
	c.Status(http.StatusBadRequest)
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": err.Error(),
	})

}

type CreateCheckoutSessionBody struct {
	SuccessURL string `json:"successUrl" form:"successUrl" binding:"required"`
	CancelURL  string `json:"cancelUrl" form:"cancelUrl" binding:"required"`
}


type CreateSubscriptionBody struct {
	Email string `json:"email" binding:"required"`
}

type SessionResponse struct {
	Identity struct {
		Traits struct {
			Email string `json:"email"`
		} `json:"traits"`
	} `json:"identity"`
}