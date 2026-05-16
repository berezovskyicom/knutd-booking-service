FROM node:20-alpine AS build
# Встановлюємо робочу директорію всередині контейнера.
# Це місце, де буде знаходитись код нашого додатку.
WORKDIR /usr/src/app
# Копіюємо файли конфігурації пакетів ('package.json' та 'package-lock.json').
# Це дозволяє Docker кешувати встановлення залежностей,
# що значно пришвидшує подальші збірки, якщо файли залежностей не
# змінились.
COPY package*.json ./
# Встановлюємо залежності проєкту.
# 'npm ci' використовується для чистої інсталяції з 'package-lock.json',
# що є більш надійним для CI/CD, ніж 'npm install'.
RUN npm ci

RUN apk add --no-cache curl

# Копіюємо весь вихідний код проєкту в робочу директорію контейнера.
COPY . .
# Збираємо (компілюємо) проєкт NestJS.
# 'npm run build' створює JavaScript файли, які виконуватимуться.
RUN npm run build

FROM node:20-alpine AS run

WORKDIR /usr/src/app

RUN apk add --no-cache curl

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/startup.sh .

ENV NODE_ENV=production
# Відкриваємо порт, який буде використовувати наш додаток.
# Це повідомляє Docker, що контейнер слухає на цьому порту.
EXPOSE 3000
# Визначаємо команду, яка буде запускатися при старті контейнера.
# 'npm run start:prod' запускає додаток у режимі продакшену.
# Це кінцева точка, яка робить наш контейнер виконуваним.
CMD [ "./startup.sh" ]