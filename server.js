const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://bwroo:123@cluster0.spsh4.mongodb.net/2537?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const pokemonSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    abilities: [Object],
    stats: [Object],
    sprites: Object,
    types: [Object],
    weight: Number,
  },
  {
    collection: "pokemon",
  }
);

const abilitySchema = new mongoose.Schema(
  {
    name: String,
    id: Number,
    pokemon: [Object],
  },
  {
    collection: "ability",
  }
);

const pokemonModel = mongoose.model("pokemon", pokemonSchema);
const typeModel = mongoose.model("ability", abilitySchema);

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  pokemonModel.find(
    {
      name: "bulbasaur",
    },
    (err, pokemon) => {
      if (err) throw err;
      console.log(pokemon);
      res.send(pokemon);
    }
  );
});

app.get("/pokemon/:id", (req, res) => {
  pokemonModel.find(
    {
      id: req.params.id,
    },
    (err, body) => {
      if (err) throw err;
      res.send(body);
    }
  );
});

app.get("/pokemon/:name", (req, res) => {
  pokemonModel.find
    ({
      name: req.params.name,
    },
    (err, body) => {
      if (err) throw err;
      res.send(body);
    })
});

app.get("/ability/:name", (req, res) => {
  typeModel.find({
      name: req.params.name,
  }, (err, body) => {
      if (err) throw err;
      res.send(body);
  });
});
