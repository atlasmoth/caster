package data

import (
	"database/sql"
	"time"
)

type User struct {
	ID                   int64     `db:"id" json:"id"`
	Email                string    `db:"email" json:"email"`
	SubscriptionID       *string   `db:"subscription_id" json:"subscription_id,omitempty"`
	SubscriptionExpiresAt *time.Time `db:"subscription_expires_at" json:"subscription_expires_at,omitempty"`
	CreatedAt            time.Time `db:"created_at" json:"created_at"`
}

type UserModel struct {
	DB *sql.DB
}

func (u UserModel) Upsert(email , subscription_id string,expiresAt time.Time) error {
	query := `
		INSERT INTO users (email, subscription_id, subscription_expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) 
		DO UPDATE SET
			subscription_id = EXCLUDED.subscription_id,
			subscription_expires_at = EXCLUDED.subscription_expires_at,
			created_at = COALESCE(users.created_at, EXCLUDED.created_at);
	`
	_, err := u.DB.Exec(query, email, subscription_id, expiresAt)
	if err != nil {
		return err
	}

	return nil
}