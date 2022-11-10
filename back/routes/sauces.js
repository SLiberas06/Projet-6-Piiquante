const express = require('express');
const router = express.Router();

const saucesControl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, saucesControl.createSauce);
router.get('/', auth, saucesControl.getAllSauces);
router.get('/:id', auth, saucesControl.getOneSauce);
router.delete('/:id', auth, multer, saucesControl.deleteSauce);
router.put('/:id', auth, multer, saucesControl.modifySauce);




module.exports = router;