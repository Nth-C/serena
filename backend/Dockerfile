FROM php:8.5-apache

# Installation des dépendances (Postgres + SSL pour les mails)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libpq-dev \
    libssl-dev \
    && docker-php-ext-install pdo pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN a2enmod rewrite

WORKDIR /var/www/html

# --- PHPMailer ---
COPY composer.json composer.lock* ./

RUN composer install --no-scripts --no-autoloader

COPY . /var/www/html/

RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www/html