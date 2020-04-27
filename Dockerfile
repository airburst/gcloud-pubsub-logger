FROM mhart/alpine-node as build

# Install build dependencies
RUN apk --no-cache add --virtual build-dependencies \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git openssh && \
  npm install --quiet node-gyp webpack webpack-cli -g

# Create app directory
RUN mkdir -p /usr/app && mkdir -p /usr/app/logs && mkdir /root/.ssh/
WORKDIR /usr/app
COPY . /usr/app

# Add ssh credentials (build requires a dependency lib)
COPY ./id_rsa /root/.ssh
RUN chmod 600 /root/.ssh/id_rsa \
  && touch /root/.ssh/known_hosts \
  && ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

# RUN npm install to build new version of bcrypt and production (dist) folder
# Remove ssh key and build dependencies
RUN  npm install && npm run build && \
  rm /root/.ssh/id_rsa && \
  rm /usr/app/id_rsa && \
  apk del build-dependencies

# Make logfiles available outside container
VOLUME  ["/usr/app/logs"]

# Must be same as port set in env vars
EXPOSE 4001

ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/app/pubsub-service.json

# Serve dist folder
CMD [ "node", "dist/index.js" ]
