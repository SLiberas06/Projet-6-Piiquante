const jwt = require("jsonwebtoken"); //verification et validation du token
require("dotenv").config();

//constante de l'appel de la string du Token placé dans .env (sécurisé)
const authToken = process.env.TOKEN;
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, authToken);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
