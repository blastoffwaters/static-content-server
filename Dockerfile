FROM node:slim

ENV NODE_ENV production
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 6677
CMD ["node", "/app/dist/app.js"]
