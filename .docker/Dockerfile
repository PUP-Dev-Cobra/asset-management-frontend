FROM node:12.13.1-slim

RUN apt-get update && apt-get upgrade
RUN apt-get install build-essential python-dev automake autoconf git inotify-tools  -y

RUN cd /tmp && \ 
    git clone https://github.com/facebook/watchman.git && \
    cd watchman && \
    git checkout v4.7.0 && \
    ./autogen.sh && \
    ./configure --enable-statedir=/tmp && \
    make && \
    make install && \
    mv watchman /usr/local/bin/watchman

COPY . /app
WORKDIR /app

RUN npm install -g cross-env rimraf
RUN npm install
