FROM node:24-alpine
COPY . /app
WORKDIR /app
RUN npm ci --production
CMD ["npm", "start"]
