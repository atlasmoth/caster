package model

import "time"

type SubscriptionPlan struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Interval    string  `json:"interval"` // "monthly" or "yearly"
	Currency    string  `json:"currency"`
	Description string  `json:"description"`
}

type Subscription struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	PlanID          string    `json:"plan_id"`
	Status          string    `json:"status"` // "active", "canceled", "pending"
	StartDate       time.Time `json:"start_date"`
	NextBillingDate time.Time `json:"next_billing_date"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	PaymentMethod   string    `json:"payment_method"` // e.g., "credit_card", "paypal"
}

type Payment struct {
	ID             string    `json:"id"`
	SubscriptionID string    `json:"subscription_id"`
	Amount         float64   `json:"amount"`
	Currency       string    `json:"currency"`
	Status         string    `json:"status"` // "successful", "failed", "pending"
	PaymentDate    time.Time `json:"payment_date"`
	FailureReason  string    `json:"failure_reason,omitempty"`
}

type CreateCustomerBody struct {
	Email string `json:"email"`
}
