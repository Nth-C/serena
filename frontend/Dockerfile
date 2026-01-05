FROM node:20-slim

WORKDIR /app

# On copie les fichiers de configuration
COPY package*.json ./

# On installe les dépendances proprement pour Linux
RUN npm install

# On copie le reste du code
COPY . .

EXPOSE 5173

# Le --host 0.0.0.0 est CRUCIAL pour l'accessibilité externe
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]