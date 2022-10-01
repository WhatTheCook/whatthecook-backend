FROM node:latest as builder

WORKDIR /app

COPY package.json ./

RUN yarn

RUN mkdir ./prisma

COPY ./prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY ./ ./

EXPOSE 5000
CMD ["node", "src/index.js"]