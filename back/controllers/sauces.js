const Sauce = require("../models/Sauce"); //importation du modèle 'Sauce'
const fs = require("fs");

//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Voir une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//Supprimer une sauce (seulement si on en est le propriétaire)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: " Non autorisé" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(201).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Modifier une sauce (seulement si on en est le propriétaire)
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non authorisé" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: "Sauce modifiée avec succés!" })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Likes/Dislikes une sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    switch (req.body.like) {
      case 1:
        if (!sauce.usersLiked.includes(req.body.userId)) {
          sauce.likes++;
          sauce.usersLiked.push(req.body.userId);
        }
        break;
      case 0:
        if (sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId, 1));
          sauce.likes--;
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(
            sauce.usersLiked.indexOf(req.body.userId, 1)
          );
        }
        break;
      case -1:
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          sauce.dislikes++;
          sauce.usersDisliked.push(req.body.userId);
        }
        break;
      default:
        break;
    }
    sauce
      .save()
      .then(() =>
        res
          .status(200)
          .json({ message: "Votre avis a bien été pris en compte!" })
      )
      .catch((error) => res.status(400).json({ error }));
  });
};
