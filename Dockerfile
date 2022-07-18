# ---- Base Node ----
FROM node:16.15.1 AS base
# set working directory
WORKDIR /app
# copy project file
COPY package.json .
 
#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0 &&\
    npm install --only=production &&\
    cp -R node_modules prod_node_modules &&\
    npm install
 
#
# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
RUN  npm run lint && npm run test
 
#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
# copy app sources
COPY ./src ./src
# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd
# expose port and define CMD
EXPOSE 8080
CMD ["npm", "run", "start"]
