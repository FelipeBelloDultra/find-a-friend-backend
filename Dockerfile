FROM node:20-alpine
USER node
WORKDIR /home/node/app
ENTRYPOINT [ "tail", "-f", "/dev/null" ]
