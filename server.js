const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const https = require("https");

pokeapiUrl = "http://localhost:3000/";

mongoose.connect(
  "mongodb+srv://bwroo:123@cluster0.spsh4.mongodb.net/2537?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: String,
  abilities: [Object],
  stats: [Object],
  sprites: Object,
  types: [Object],
  weight: Number,
}, {
  collection: "pokemon",
});

const abilitySchema = new mongoose.Schema({
  name: String,
  id: Number,
  pokemon: [Object],
}, {
  collection: "ability",
});

const timelinesSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});

const pokemonModel = mongoose.model('pokemon', pokemonSchema);
const typeModel = mongoose.model('ability', abilitySchema);
const timelinesModel = mongoose.model('timelines', timelinesSchema)


app.use(express.static("public"));

app.use(bodyparser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  pokemonModel.find({
      name: "bulbasaur",
    },
    (err, pokemon) => {
      if (err) throw err;
      console.log(pokemon);
      res.send(pokemon);
    }
  );
});

// app.get("/pokemon/:name", (req, res) => {
//   let queryObject = isNaN(req.params.name) ? {
//     name: req.params.name
//   } : {
//     id: req.params.name
//   };
//   pokemonModel.find(queryObject,
//     (err, body) => {
//       if (err) throw err;
//       res.send(body);
//     }
//   );
// });

app.get("/profile/:id", (req, res) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  pokemon = ""

  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      pokemon += chunk
    })
    https_res.on("end", function () {
      // pokemon += chunk
      pokemon = JSON.parse(pokemon)

      tmp = pokemon.stats.filter((obj) => {
        return obj.stat.name == "hp"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )

      atk = pokemon.stats.filter((obj) => {
        return obj.stat.name == "attack"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )

      dfsn = pokemon.stats.filter((obj) => {
        return obj.stat.name == "defense"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )

      spclatk = pokemon.stats.filter((obj) => {
        return obj.stat.name == "special-attack"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )
      spcldfsn = pokemon.stats.filter((obj) => {
        return obj.stat.name == "special-defense"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )
      speed = pokemon.stats.filter((obj) => {
        return obj.stat.name == "speed"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )
      res.render("profile.ejs", {
        "id": req.params.id,
        "name": pokemon.name,
        "hp": tmp[0],
        "attack": atk[0],
        "defense": dfsn[0],
        "specialatk": spclatk[0],
        "defenseatk": spcldfsn[0],
        "speed": speed[0]
      });
    })
  })
});


app.get("/ability/:name", (req, res) => { //This will give you the type of pokemon
  typeModel.find({
    name: req.params.name,
  }, (err, body) => {
    if (err) throw err;
    res.send(body);
  });
});

// This is where the timeline js begins

app.get("/timeline/getAllEvents", function (req, res) {
  timelinesModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
})

app.post('/timeline/insert', function (req, res) {
  timelinesModel.create({
      'text': req.body.text,
      'time': req.body.time,
      'hits': req.body.hits
  }, function (err, data) {
      if (err) {
          console.log("Error " + err);
      } else {
          console.log("Data " + data);
      }
      res.send("Insertion is successful!");
  });
})

app.get("/timeline/delete/:id", function (req, res) {
  // console.log(req.body)
  timelinesModel.remove({
    '_id': req.params.id
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Delete request is successful!");
  });
})

app.get("/timeline/inscreaseHits/:id", function (req, res) {
  // console.log(req.body)
  timelinesModel.updateOne({
    _id: req.params.id,
  }, {
    $inc: {
      hits: 1
    }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Update request is successful!");
  });
})

app.get("/timeline", function (req, res) {
  timelinesModel.find({}, function (err, timelineLogs) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(timelineLogs));
    }
    res.send(JSON.stringify(timelineLogs));
  });
})

app.put("/timeline/delete/:id", function (req, res) {
  timelinesModel.deleteOne({
    _id: req.params.id
  }, function (err, data) {
    if (err) console.log(err);
    else
      console.log(data);
    res.send("All good! Deleted.")
  });
})

app.get("/timeline/update/:id", function (req, res) {
  timelinesModel.updateOne({
    id: req.params.id
  }, {
    $inc: {
      hits: 1
    }
  }, function (err, data) {
    if (err) console.log(err);
    else
      console.log(data);
    res.send("All good! Updated.")
  });
})

app.get("/timeline/removeAll", function (req, res) {
  timelinesModel.deleteMany({
    hits: {
      $gt: 0
    },
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Everything Deleted");
    }
    res.send("Everything has been deleted!");
  })
});