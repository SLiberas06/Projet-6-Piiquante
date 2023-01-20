require("dotenv").config(); //import du fichier .env pour sécuriser les éléments fragiles
const express = require("express"); //pour une meilleure pratique de node.js
const mongoose = require("mongoose"); //import d'une base de donnée
const path = require("path"); //import pour traiter des chemins de fichiers (images)


//constante de l'appel de la string de connexion à mongoDb placé dans .env (sécurisé)
const mongoDB = process.env.MONGODB;

//importation des routes sauces et users
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

//Utilisation de express en format Json
const app = express();
app.use(express.json());

//Connexion a mongoBD Atlas
mongoose
  .connect(mongoDB)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Cors = partage des ressources entre origines multiples, permet de sécurisé le transfert des données entre deux PORT differents (front:4200/back:3000)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Parcours/chemin URL, en intrégrant les routes importées
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
