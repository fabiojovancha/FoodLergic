FROM node:18.17.1

WORKDIR /app

ENV PORT 8080
ENV MODEL_URL 'https://storage.googleapis.com/foodlergic-model/model.json'
ENV NODE_ENV production

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start" ]
