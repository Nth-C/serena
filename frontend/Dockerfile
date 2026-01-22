FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# On copie les fichiers de configuration
COPY package*.json ./

# On installe les dépendances proprement pour Linux
RUN npm install


RUN npx playwright install --with-deps

# On copie le reste du code
COPY . .

EXPOSE 5173

# Le --host 0.0.0.0 est CRUCIAL pour l'accessibilité externe
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]