package feed

import (
	"context"
	"fmt"
	"net/http"

	"github.com/antihax/optional"
	neynarv2 "github.com/atlasmoth/go_neynar_sdk/v2"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	apiKey       *string
	neynarClient *neynarv2.APIClient
}

func returnErrorResponse(c *gin.Context, err error) {
	fmt.Printf("Error: %+v",err)
	c.Status(http.StatusBadRequest)
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": err.Error(),
	})

}

func New(apiKey *string, neynarClient *neynarv2.APIClient) *Controller {
	return &Controller{apiKey, neynarClient}
}

func (ctrl *Controller) GetFeed(c *gin.Context) {
	cursor := c.Query("cursor")
	feed, response, err := ctrl.neynarClient.FeedApi.Feed(context.Background(),*ctrl.apiKey,neynarv2.FILTER_FeedType,&neynarv2.FeedApiFeedOpts{EmbedTypes: optional.NewInterface("image,video") , Cursor: optional.NewString(cursor),FilterType:  optional.NewInterface("embed_type")})
	
	fmt.Println(response.Request.URL.String())
	if err != nil {
		returnErrorResponse(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    feed,
	})

}
