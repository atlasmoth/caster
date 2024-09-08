package feed

import (
	"context"
	"net/http"

	"github.com/antihax/optional"
	"github.com/atlasmoth/caster/backend/internal/data"
	neynarv2 "github.com/atlasmoth/go_neynar_sdk/v2"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	apiKey       *string
	neynarClient *neynarv2.APIClient
}


func New(apiKey *string, neynarClient *neynarv2.APIClient) *Controller {
	return &Controller{apiKey, neynarClient}
}

func (ctrl *Controller) GetFeed(c *gin.Context) {
	cursor := c.Query("cursor")
	feed, _, err := ctrl.neynarClient.FeedApi.Feed(context.Background(),*ctrl.apiKey,neynarv2.FILTER_FeedType,&neynarv2.FeedApiFeedOpts{EmbedTypes: optional.NewInterface("image,video") , Cursor: optional.NewString(cursor),FilterType:  optional.NewInterface("embed_types"), Limit:  optional.NewInt32(100)})
	
	if err != nil {
		data.ReturnErrorResponse(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    feed,
	})

}
