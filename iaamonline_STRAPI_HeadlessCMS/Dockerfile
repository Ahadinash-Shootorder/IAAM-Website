FROM node:20.11-alpine AS build

# sharp support
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

ENV NODE_ENV=production

WORKDIR /opt/
COPY package.json package-lock.json ./

# clean install (LOCK FILE FOLLOW)
RUN npm ci

WORKDIR /opt/app
COPY . .

RUN npm run build

# ---------- PRODUCTION IMAGE ----------
FROM node:20-alpine

RUN apk add --no-cache vips-dev

ENV NODE_ENV=production

WORKDIR /opt/app

COPY --from=build /opt/node_modules ./node_modules
COPY --from=build /opt/app ./

EXPOSE 1337

CMD ["npm", "run", "start"]






# FROM node:20.11-alpine AS build
# # Installing libvips-dev for sharp Compatibility
# RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
# ENV NODE_ENV=production

# WORKDIR /opt/
# COPY package.json package-lock.json ./
# RUN npm ci --only=production
# RUN npm install better-sqlite3

# WORKDIR /opt/app
# COPY . .
# RUN npm run build

# FROM node:20-alpine
# RUN apk add --no-cache vips-dev
# ENV NODE_ENV=production
# WORKDIR /opt/app
# COPY --from=build /opt/node_modules ./node_modules
# COPY --from=build /opt/app ./

# EXPOSE 1337
# CMD ["npm", "run", "start"]


