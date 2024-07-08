const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload'); 

const router = express.Router();

router.get('/', authenticateToken, getAllProducts);
router.post('/', authenticateToken, upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
