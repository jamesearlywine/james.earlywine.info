FROM ubuntu:16.04

USER root

EXPOSE 80

# basic OS dependencies
RUN apt-get update \
    && apt-get install -y lsb-release \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    git

# node
RUN apt-get install -y nodejs \
    npm \
    && ln -s /usr/bin/nodejs /usr/bin/node

# npm packages (build and dependency-manager)
RUN npm install -g gulp \
    && npm install -g bower

# nginx
RUN apt-get install -y nginx

# start the webserver
CMD nginx -g 'daemon off;'