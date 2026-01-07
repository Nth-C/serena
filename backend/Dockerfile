FROM php:8.5-apache
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip
# Récupère Composer depuis l'image officielle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# Installation de l'extension PDO pour PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql
# Activation du mod_rewrite pour les routes propres
RUN a2enmod rewrite
COPY . /var/www/html/
