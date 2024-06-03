FROM node:20-alpine AS base
USER node
WORKDIR /home/node/app

FROM base AS builder
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate && \
  npm run build

FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/app/package*.json ./
COPY --chown=node:node --from=builder /home/node/app/dist ./dist
RUN npm prune --production
CMD [ "npm", "run", "start:prod" ]
