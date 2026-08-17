# Stage 1: precompiled gRPC extension
FROM liast/php82-grpc-proto-extensions:latest AS grpc_extensions


# Stage 2: Laravel + Apache
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Copy precompiled PHP extensions from stage 1
COPY --from=grpc_extensions /usr/local/lib/php/extensions/ /tmp/php-extensions/

# Copy grpc.so into this PHP image and enable it
RUN GRPC_FILE="$(find /tmp/php-extensions -name grpc.so -type f | head -n 1)" \
    && test -n "$GRPC_FILE" \
    && cp "$GRPC_FILE" "$(php-config --extension-dir)/grpc.so" \
    && docker-php-ext-enable grpc \
    && rm -rf /tmp/php-extensions


RUN a2enmod rewrite

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html


# Copy Composer files first for Docker cache
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-source

# Copy Laravel project
COPY . .


RUN composer dump-autoload --optimize


RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache
RUN usermod -a -G 1000 www-data

RUN sed -ri \
    -e 's!/var/www/html!/var/www/html/public!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf


EXPOSE 80

CMD ["sh", "-c", "php artisan migrate --force && php artisan db:seed --force && apache2-foreground"]
