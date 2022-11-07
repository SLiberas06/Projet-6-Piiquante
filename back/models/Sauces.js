const mongoose = require('mongoose');

const modelSauces = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    userLiked: { type: ['String <userId>'], required: true },
    userDisliked: { type: ['String <userId>']},
});
 
module.exports = mongoose.model('Sauces', modelSauces);