const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//user:destinationDB,pass:6Nuc2XPZjAsTsfux

const uri =
  "mongodb+srv://destinationDB:6Nuc2XPZjAsTsfux@cluster0.95hki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("destinationVacation");
    const serviceCollection = database.collection("services");
    const bookingCollection = database.collection("booking");

    //get api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/myBooking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });

    //post api
    app.post("/services", async (req, res) => {
      const newAddService = req.body;
      const result = await serviceCollection.insertOne(newAddService);
      //   console.log("got new service", req.body);
      //   console.log("added service", result);
      res.json(result);
    });

    app.post("/createBooking", async (req, res) => {
      const newAddBooking = req.body;
      const result = await bookingCollection.insertOne(newAddBooking);
      //   console.log("got new service", req.body);
      //   console.log("added service", result);
      res.json(result);
    });

    //update api
    app.put("/myBookings/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "approve",
        },
      };
      const result = await bookingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //delete api

    app.delete("/myBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.deleteOne(query);
      res.send(booking);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hi from my node");
});

// const services = [
//   { id: 0, name: "lopa", email: "lopa@gmail.com", phone: "017888888" },
//   { id: 1, name: "shabana", email: "shabana@gmail.com", phone: "017888888" },
//   { id: 2, name: "dev", email: "dev@gmail.com", phone: "017888888" },
//   { id: 3, name: "jeet", email: "jeet@gmail.com", phone: "017888888" },
//   { id: 4, name: "koel", email: "koel@gmail.com", phone: "017888888" },
//   { id: 5, name: "dipa", email: "dipa@gmail.com", phone: "017888888" },
//   { id: 6, name: "runu", email: "runu@gmail.com", phone: "017888888" },
// ];

// app.get("/services", (req, res) => {
//   res.send(services);
// });

// app.post("/services", (req, res) => {
//   const newService = req.body;
//   newService.id = services.length;
//   services.push(newService);

//   console.log("hitting the post", req.body);
//   res.json(newService);
// });

// app.get("/services/:id", (req, res) => {
//   const id = req.params.id;
//   const service = services[id];
//   res.send(service);
// });

app.listen(port, () => {
  console.log("listening to port", port);
});
