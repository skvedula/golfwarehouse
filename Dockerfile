FROM registry2.prod.bbhosted.com/nodejs-docker-base:latest

MAINTAINER Branding Brand <ops@brandingbrand.com>

WORKDIR /app
ADD . /app
RUN ./configure_node
RUN npm install
CMD node app
