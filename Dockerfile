FROM node:11.10.1
WORKDIR /app
CMD yarn start
COPY package.json yarn.lock ./
RUN yarn install
COPY . .