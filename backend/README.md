# Running the Backend

## Create .env file with the following values

```bash
DATABASE_NAME=<DATABASE_NAME>
DATABASE_USER=<DATABASE_USER>
DATABASE_PASSWORD=<DATABASE_PASSSWORD>
SECRETS_CIPHER=<SECRETS_CIPHER_FOR_ORY_KRATOS>
SECRETS_COOKIE=<SECRETS_COOKIE_FOR_ORY_KRATOS>
STRIPE_API_KEY=<STRIPE_API_KEY>
STRIPE_WEBHOOK_SECRET=<STRIPE_WEBHOOK_SECRET>
DSN=<DSN_FOR_DATABASE>
SELFSERVICE_METHODS_OIDC_CONFIG_PROVIDERS='[ { "id": "google", "provider": "google", "mapper_url": "file:///etc/config/kratos/mapper.jsonnet", "client_id": GOOGLE_CLIENT_ID, "client_secret": GOOGLE_CLIENT_SECRET, "scope": ["openid", "email", "profile"], "auth_url": "https://accounts.google.com/o/oauth2/v2/auth", "token_url": "https://www.googleapis.com/oauth2/v4/token", "issuer_url": "https://accounts.google.com" } ]'
NEYNAR_API_KEY='NEYNAR_API_KEY'
SERVE_PUBLIC_BASE_URL='KRATOS_PUBLIC_BASE_URL'
BASE_URL='BASE_URL_OF_API'

```

## Start Docker Compose

```bash
docker compose -f dev_docker_compose.yml up -d
```
