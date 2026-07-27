FROM php:8.3-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/public \
    COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        curl \
        unzip \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libpq-dev \
        libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        gd \
        opcache \
        pdo_mysql \
        pdo_pgsql \
        zip \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Install dependencies first so Docker can reuse this layer when app code changes.
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts

COPY . .

RUN composer dump-autoload --no-dev --optimize \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache \
    && sed -i 's/\r$//' docker/render-entrypoint.sh \
    && chmod +x docker/render-entrypoint.sh

COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf.template

EXPOSE 10000

ENTRYPOINT ["/var/www/docker/render-entrypoint.sh"]
CMD ["apache2-foreground"]
