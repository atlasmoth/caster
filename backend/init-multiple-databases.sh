#!/bin/bash

set -e
set -u

function create_user_and_database() {
    local database=$1
    echo "  Checking if database '$database' exists"
    if ! psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$database"; then
        echo "  Creating user and database '$database'"
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            CREATE USER $database;
            CREATE DATABASE $database;
            GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
EOSQL
    else
        echo "  Database '$database' already exists"
    fi
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        create_user_and_database $db
    done
    echo "Multiple databases processed"
fi