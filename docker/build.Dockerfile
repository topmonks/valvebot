# build Typescript
FROM node:20-alpine3.17 as ts-compiler
WORKDIR /usr/app

COPY package*.json ./
COPY package/chore/package.json ./package/chore/
COPY package/hub/package.json ./package/hub/
COPY package/outpost/binance/package.json ./package/outpost/binance/
COPY package/protobuf/package.json ./package/protobuf/

COPY tsconfig.json ./
COPY package/chore/tsconfig.json ./package/chore/
COPY package/hub/tsconfig.json ./package/hub/
COPY package/outpost/binance/tsconfig.json ./package/outpost/binance/
COPY package/protobuf/tsconfig.json ./package/protobuf/

RUN npm install
COPY . ./
RUN npm run build

# copy build

FROM node:20-alpine3.17 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/package/chore/package.json ./package/chore/
COPY --from=ts-compiler /usr/app/package/hub/package.json ./package/hub/
COPY --from=ts-compiler /usr/app/package/outpost/binance/package.json ./package/outpost/binance/
COPY --from=ts-compiler /usr/app/package/protobuf/package.json ./package/protobuf/

COPY --from=ts-compiler /usr/app/package/hub/dist ./package/hub/dist/
COPY --from=ts-compiler /usr/app/package/outpost/binance/dist ./package/outpost/binance/dist/
COPY --from=ts-compiler /usr/app/package/protobuf/dist ./package/protobuf/dist/
RUN npm install --omit=dev

CMD ["index.js"]