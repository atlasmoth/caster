FROM golang:1.23.0-alpine3.20

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN go mod download


EXPOSE 8084

CMD ["sh", "-c", "go build -o /app/main billing/cmd/*.go && ./main"]
