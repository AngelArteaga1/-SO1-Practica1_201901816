package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	//"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Operation struct {
	Left     float64
	Operator string
	Right    float64
}

type Record struct {
	Left     float64 `json:"left,omitempty" bson:"left,omitempty"`
	Operator string  `json:"operator,omitempty" bson:"operator,omitempty"`
	Right    float64 `json:"right,omitempty" bson:"right,omitempty"`
	Result   float64 `json:"result,omitempty" bson:"result,omitempty"`
	Date     string  `json:"date,omitempty" bson:"date,omitempty"`
}

type Response struct {
	Success bool    `json:"success,omitempty" bson:"success,omitempty"`
	Message string  `json:"message,omitempty" bson:"message,omitempty"`
	Result  float64 `json:"result,omitempty" bson:"result,omitempty"`
}

var connectionString string

func main() {
	/*err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error al cargar .env")
	}*/
	user := os.Getenv("MONGO_USERNAME")
	password := os.Getenv("MONGO_PASSWORD")
	host := os.Getenv("MONGO_HOST")
	connectionString = "mongodb://" + user + ":" + password + "@" + host + "/?authSource=admin&compressors=disabled&gssapiServiceName=mongodb"
	request()
}

func request() {
	fmt.Println("Todo corriendo bien")
	Servidor := mux.NewRouter().StrictSlash(true)
	Servidor.HandleFunc("/", homePage)
	Servidor.HandleFunc("/addOperation", addOperation).Methods("POST")
	Servidor.HandleFunc("/showOperations", showOperations).Methods("GET")
	log.Fatal(http.ListenAndServe(":5000", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(Servidor)))
}

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "[SO1]Practica1_201901816")
}

func addOperation(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var data Operation
	json.Unmarshal(body, &data)
	var resultado float64
	if data.Operator == "/" && data.Right == 0 {
		resultado = 0
		respuesta := Response{
			Success: true,
			Message: "Sintax error",
			Result:  resultado,
		}
		json, _ := json.Marshal(respuesta)
		fmt.Fprint(w, string(json))
		return
	} else {
		resultado = operate(data)
	}
	insert(data, resultado)
	respuesta := Response{
		Success: true,
		Message: "Se ha agregado correctamente",
		Result:  resultado,
	}
	json, _ := json.Marshal(respuesta)
	fmt.Fprint(w, string(json))
}

func showOperations(w http.ResponseWriter, r *http.Request) {
	client, err := mongo.NewClient(options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	practicaDatabase := client.Database("db_practica1")
	operationsCollection := practicaDatabase.Collection("operations")

	cursor, err := operationsCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	var operations []bson.M
	err = cursor.All(ctx, &operations)
	if err != nil {
		log.Fatal(err)
	}

	var records []Record
	for _, operation := range operations {
		var tmpRecord Record
		bsonBytes, _ := bson.Marshal(operation)
		bson.Unmarshal(bsonBytes, &tmpRecord)
		records = append(records, tmpRecord)
	}
	json, err := json.Marshal(records)
	fmt.Fprint(w, string(json))
}

func insert(operation Operation, result float64) {
	//AQUI DEBERIAMOS DE INSERTAR EN MONGODB
	client, err := mongo.NewClient(options.Client().ApplyURI(connectionString))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	practicaDatabase := client.Database("db_practica1")
	operationsCollection := practicaDatabase.Collection("operations")
	operationResult, err := operationsCollection.InsertOne(ctx, bson.D{
		{Key: "left", Value: operation.Left},
		{Key: "operator", Value: operation.Operator},
		{Key: "right", Value: operation.Right},
		{Key: "result", Value: result},
		{Key: "date", Value: time.Now().Format("2006-01-02 15:04:05")},
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(operationResult.InsertedID)
}
func operate(operation Operation) float64 {
	if operation.Operator == "+" {
		return operation.Left + operation.Right
	} else if operation.Operator == "-" {
		return operation.Left - operation.Right
	} else if operation.Operator == "*" {
		return operation.Left * operation.Right
	} else {
		return operation.Left / operation.Right
	}
}
