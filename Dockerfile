FROM node:26.12.1-alpine
COPY . /app
WORKDIR /app
RUN npm ci --omit=dev
CMD ["npm", "start"]
