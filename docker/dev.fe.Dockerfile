# pull official base image
FROM node:16.14.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# prevent react from inlining scripts and images, so that we can
# maintain a strict Content-Security-Policy
# https://drag13.io/posts/react-inline-runtimer-chunk/index.html
ENV INLINE_RUNTIME_CHUNK=false
ENV IMAGE_INLINE_SIZE_LIMIT=0

# add app (incl. dependencies)
COPY ./fe/package.json ./
COPY ./fe/package-lock.json ./
COPY ./fe/.eslintrc.json ./
COPY ./fe/.prettierrc.json ./
COPY ./fe/src/ ./src/
COPY ./fe/public/ ./public/

# install dependencies
RUN npm ci

# start app
CMD ["npm", "start"]
