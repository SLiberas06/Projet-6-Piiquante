const bcrypt = require('bcrypt');//pour haché le mot de passe user
const jsonWebToken = require('jsonwebtoken');//vérification et validation du token
const User = require('../models/User');//importation du modèle 'User'

require('dotenv').config();//configuration du fichier .env
const userToken = process.env.TOKEN;//Token caché dans le fichier .env (sécurisé)


//Inscription utilisateur
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//Connexion utilisateur 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user=> {
        if (!user){
            return res.status(401).json({ message: 'Identifiant/E-mail incorrect' });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid=>{
            if (!valid){
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
            res.status(200).json({
                userId: user._id,
                token:jsonWebToken.sign(
                    { userId: user._id },
                    userToken,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
