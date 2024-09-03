package feed

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	neynarv2 "github.com/atlasmoth/go_neynar_sdk/v2"
	"github.com/gin-gonic/gin"
)

type Controller struct {
	apiKey       *string
	neynarClient *neynarv2.APIClient
}

func returnErrorResponse(c *gin.Context, err error) {
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
	fmt.Println(ctrl.apiKey)
	cursor := c.Query("cursor")
	_, response, _ := ctrl.neynarClient.FeedAPI.Feed(context.Background()).ApiKey(*ctrl.apiKey).FilterType(neynarv2.FILTERTYPE_EMBED_TYPES).FeedType(neynarv2.FEEDTYPE_FILTER).Cursor(cursor).EmbedTypes([]neynarv2.EmbedType{neynarv2.EMBEDTYPE_VIDEO, neynarv2.EMBEDTYPE_IMAGE}).Limit(100).WithRecasts(true).Execute()

	defer response.Body.Close()
	
	// if err != nil {
	// 	returnErrorResponse(c, err)
	// 	return
	// }
	var responseData map[string]interface{}
	if err := json.NewDecoder(response.Body).Decode(&responseData); err != nil {
		returnErrorResponse(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    responseData,
	})

}
