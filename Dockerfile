FROM node:18-alpine AS builder
RUN addgroup app && adduser --disabled-password --ingroup app app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY ./src/. /usr/src/app/src
COPY tsconfig.json /usr/src/app/tsconfig.json
RUN ./node_modules/typescript/bin/tsc --p .

FROM node:18-alpine AS prodBuilder
WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install --only=production
RUN node -pe 'require("/usr/src/app/package.json").version' > version.txt

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=prodBuilder /usr/src/app/version.txt  version.txt
COPY --from=prodBuilder /usr/src/app/node_modules node_modules/
COPY --from=builder /usr/src/app/dist/ dist/
CMD npm_package_version=$(cat /usr/src/app/version.txt) node dist/main.js
