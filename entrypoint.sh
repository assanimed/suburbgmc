#!/usr/bin/env sh

echo "Starting setup..."

echo "pulling prisma schemas"

npx prisma db pull


exec "$@"