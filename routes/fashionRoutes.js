const express = require('express');
const fashionController = require('../controllers/fashionController');

const router = express.Router();

router.get('/fashion-data', async (req, res) => {
  try {
    const fashionData = await fashionController.fetchFashionMNISTData();
    res.json(fashionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;