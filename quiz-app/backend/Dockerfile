##Start with an image that already has Node.js installed.
FROM node:20   


##Inside the container, /app becomes our project directory.
WORKDIR /app

## copy all that start with package.json and package-lock.json to the working directory
COPY package*.json ./


## This installs the dependencies from your package-lock.json.
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 600000 \
    && npm ci


## Now we copy the rest of your backend into the image.
COPY . .

EXPOSE 2323

## Finally, we tell Docker how to run our app.
CMD ["node", "server.js"]

