FROM node:14 AS builder
RUN groupadd -r app && useradd -r -g app app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY ./src/. /usr/src/app/src
COPY tsconfig.json /usr/src/app/tsconfig.json
RUN ./node_modules/typescript/bin/tsc --p .

FROM node:14
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist/ dist/

CMD node dist/main.js 
