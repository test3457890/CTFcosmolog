FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js social.js forensics.js capstone.js sqlite.js story.js ./
COPY public ./public
COPY etc ./etc
COPY flag.txt ./flag.txt
EXPOSE 3000
CMD ["npm", "start"]
