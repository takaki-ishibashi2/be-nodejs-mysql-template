FROM node:carbon

ENV ROOT_DIR="/workspace"
ENV PORT=8081

# Create working directory
WORKDIR $ROOT_DIR

# Bundle app source
COPY . $ROOT_DIR

EXPOSE $PORT

CMD ["npm", "start"]
