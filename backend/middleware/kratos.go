package kratos

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	oryClient "github.com/ory/client-go"
)

type kratosMiddleware struct {
	ory *oryClient.APIClient
}

func NewMiddleware(url string) *kratosMiddleware {
	cfg := oryClient.NewConfiguration()
	cfg.Servers = []oryClient.ServerConfiguration{
		{
			URL: url,
		},
	}
	return &kratosMiddleware{
		ory: oryClient.NewAPIClient(cfg),
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

func (k *kratosMiddleware) validateSession(r *http.Request) (*oryClient.Session, error) {

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

	var sessionBody oryClient.Session

	err = json.NewDecoder(res.Body).Decode(&sessionBody)

	if err != nil {
		return nil, err
	}

	return &sessionBody, nil
}
