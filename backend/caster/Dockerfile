FROM golang:1.23.0-alpine3.20

WORKDIR /app

COPY . .

RUN go mod download


EXPOSE 8083

CMD ["sh", "-c", "go build -o /app/main caster/cmd/*.go && ./main"]