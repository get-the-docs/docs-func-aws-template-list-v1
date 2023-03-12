FROM public.ecr.aws/lambda/nodejs:18

COPY app.ts package*.json ./

#RUN npm install
RUN npm ci --production

CMD ["app.lambdaHandler"]
