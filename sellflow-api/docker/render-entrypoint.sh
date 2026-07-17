#!/usr/bin/env sh
set -eu

PORT="${PORT:-10000}"

# Prevent local MySQL settings copied into Render from overriding PostgreSQL.
if [ "${DB_CONNECTION:-}" = "pgsql" ] && { [ -z "${DB_PORT:-}" ] || [ "${DB_PORT}" = "3306" ]; }; then
    export DB_PORT=5432
fi

printf 'Listen %s\n' "$PORT" > /etc/apache2/ports.conf
sed "s/__PORT__/$PORT/g" /etc/apache2/sites-available/000-default.conf.template \
    > /etc/apache2/sites-available/000-default.conf

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

if [ "${PRODUCT_IMAGE_DISK:-public}" = "public" ] && [ ! -e public/storage ]; then
    php artisan storage:link
fi

# Cache configuration only after Render has injected production environment values.
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Free Render services do not support pre-deploy commands. Migrations are
# idempotent and run before Apache starts when explicitly enabled.
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php artisan migrate --force
fi

exec "$@"
