// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "HTTP Server",
      script: "npm run start:server",
    },
    {
      name: "Queue Worker",
      script: "npm run start:queue",
    },
  ],
};
