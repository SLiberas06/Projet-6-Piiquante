const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');


  const app = express();
  app.use(express.json());

mongoose.connect('mongodb+srv://Sabrina:Margo57!@cluster0.zzhrkpw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-type, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



app.use('/api/auth', userRoutes);

module.exports = app;