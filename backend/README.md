Format go files:
gofmt -s -w .

Run migrations:
migrate -path=internal/database/migrations -database DSN -verbose up
