# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV production
ENV PORT 3000

# Setting up the work directory
WORKDIR /app

# Copying all the files in our project
COPY . .

# Installing all the dependencies
RUN npm install

# Exposing the port
EXPOSE 3000

# Running the app
CMD ["npm", "start"]
