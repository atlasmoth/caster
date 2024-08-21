package kratos

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ory/client-go"
)

type kratosMiddleware struct {
	ory *client.APIClient
}

func NewMiddleware(url string) *kratosMiddleware {
	cfg := client.NewConfiguration()
	cfg.Servers = []client.ServerConfiguration{
		{
			URL: url,
		},
	}
	return &kratosMiddleware{
		ory: client.NewAPIClient(cfg),
	}
}

func (k *kratosMiddleware) Session() gin.HandlerFunc {
	return func(c *gin.Context) {
		session, err := k.validateSession(c.Request)
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		if !*session.Active {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		c.Set("session", session)
		c.Next()
	}
}

func (k *kratosMiddleware) validateSession(r *http.Request) (*client.Session, error) {
	cookie, err := r.Cookie("ory_session_playground")
	if err != nil {
		return nil, err
	}
	if cookie == nil {
		return nil, errors.New("no session found in cookie")
	}

	resp, _, err := k.ory.FrontendAPI.ToSession(context.Background()).Cookie(cookie.String()).Execute()
	if err != nil {
		return nil, err
	}
	return resp, nil
}
