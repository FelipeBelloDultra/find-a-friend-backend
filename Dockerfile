FROM node:20-alpine AS base
USER node
WORKDIR /home/node/app

FROM base AS builder
COPY ./package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
COPY --from=builder /home/node/app/dist ./dist
ENV NODE_ENV=production
COPY ./package*.json ./
RUN npm ci
CMD [ "npm", "run", "start" ]
