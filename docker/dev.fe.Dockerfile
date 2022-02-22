# pull official base image
FROM node:16.14.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app (incl. dependencies)
COPY ../fe/ ./

# install dependencies
RUN npm install

# start app
CMD ["npm", "start"]
