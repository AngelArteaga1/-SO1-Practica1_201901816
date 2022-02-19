FROM golang:1.17.7
WORKDIR /backend
COPY . . 
RUN go get -u go.mongodb.org/mongo-driver/mongo
RUN go get -u github.com/gorilla/mux
RUN go get -u github.com/gorilla/handlers
ENV MONGO_HOST=127.0.0.1:4000
ENV MONGO_USERNAME=mongoadmin
ENV MONGO_PASSWORD=So1pass_2022
EXPOSE 5000
CMD ["./main"]