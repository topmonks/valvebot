# build Typescript
FROM node:20-alpine3.17 as ts-compiler
RUN apk add --no-cache protoc

WORKDIR /usr/app

COPY package*.json ./
COPY package/chore/package.json ./package/chore/
COPY package/hub/package.json ./package/hub/
COPY package/lib/package.json ./package/lib/
COPY package/outpost/binance/package.json ./package/outpost/binance/
COPY package/outpost/injective/package.json ./package/outpost/injective/
COPY package/protobuf/package.json ./package/protobuf/

COPY tsconfig.json ./
COPY package/chore/tsconfig.json ./package/chore/
COPY package/hub/tsconfig.json ./package/hub/
COPY package/lib/tsconfig.json ./package/lib/
COPY package/outpost/binance/tsconfig.json ./package/outpost/binance/
COPY package/outpost/injective/tsconfig.json ./package/outpost/injective/
COPY package/protobuf/tsconfig.json ./package/protobuf/

RUN npm install

# copy whole folder protobuf with .proto files
COPY package/protobuf ./package/protobuf/

COPY . ./
RUN npm run build

FROM node:20-alpine3.17 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/package/chore/package.json ./package/chore/
COPY --from=ts-compiler /usr/app/package/hub/package.json ./package/hub/
COPY --from=ts-compiler /usr/app/package/lib/package.json ./package/lib/
COPY --from=ts-compiler /usr/app/package/outpost/binance/package.json ./package/outpost/binance/
COPY --from=ts-compiler /usr/app/package/outpost/injective/package.json ./package/outpost/injective/
COPY --from=ts-compiler /usr/app/package/protobuf/package.json ./package/protobuf/

COPY --from=ts-compiler /usr/app/package/hub/dist ./package/hub/dist/
COPY --from=ts-compiler /usr/app/package/lib/dist ./package/lib/dist/
COPY --from=ts-compiler /usr/app/package/outpost/binance/dist ./package/outpost/binance/dist/
COPY --from=ts-compiler /usr/app/package/outpost/injective/dist ./package/outpost/injective/dist/
COPY --from=ts-compiler /usr/app/package/protobuf/dist ./package/protobuf/dist/
RUN npm install --omit=dev
