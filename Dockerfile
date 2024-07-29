FROM node:lts-alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn


# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v13.5.0 works with Chromium 100.
RUN yarn add puppeteer@13.5.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app /home/pptruser/gmc \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /home/pptruser/gmc

# Run everything after as non-privileged user.
# USER pptruser

WORKDIR /home/pptruser/gmc

COPY package*.json ./

RUN yarn install



COPY . .

# RUN npx prisma generate

RUN chown -R pptruser:pptruser /home/pptruser/gmc

RUN npm install prisma

ENV NODE_ENV=production
ENV RABBITMQ_URL=amqp://med:Assanimed!_1420@localhost
ENV FILE_UPLOAD_URL=http://localhost:3000/api/upload
ENV DATABASE_URL=mysql://med:Assanimed!_1420@localhost:3306/gmcdb

COPY entrypoint.sh /home/pptruser/gmc/entrypoint.sh
RUN chown pptruser:pptruser /home/pptruser/gmc/entrypoint.sh && \
    chmod +x /home/pptruser/gmc/entrypoint.sh

ENTRYPOINT [ "/home/pptruser/gmc/entrypoint.sh" ]
CMD [ "node", "listener.js" ] 
