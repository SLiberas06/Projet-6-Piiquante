const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) => res.status(400).json({ error: "impossible" }));
    })
    .catch((error) => res.status(500).json({ error: "impossible2"}));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user=> {
        if (!user){
            return res.status(401).json({message: 'Identifiant/E-mail incorrect'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid=>{
            if (!valid){
                return res.status(401).json({message: 'Mot de passe incorrect'});
            }
            res.status(200).json({
                userId: user._id,
                token:jsonWebToken.sign(
                    {userId: user._id},
                    process.env.TOKEN_KEY,
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error:"erreur comparaison"}));
    })
    .catch(error => res.status(500).json({error:"erreur identifiant"}));
};
