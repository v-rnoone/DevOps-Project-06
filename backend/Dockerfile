FROM node:20-alpine
RUN apk add --no-cache postgresql-client
WORKDIR /app
COPY package*.json .
RUN npm install --production
COPY . .
RUN chmod +x entrypoint.sh
EXPOSE 3000
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "node", "server.js" ]