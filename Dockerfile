FROM node:10.16.0

RUN groupadd -r app && useradd -r -g app app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install

COPY ./src/. /usr/src/app/src

COPY tsconfig.json /usr/src/app/tsconfig.json

RUN ./node_modules/typescript/bin/tsc --p .
