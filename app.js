const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const fashionRoutes = require('./routes/fashionRoutes');
const authRoutes = require('./routes/authRoutes'); 
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/fashion', fashionRoutes);

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware untuk penanganan error jika endpoint tidak ditemukan
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Middleware untuk penanganan error umum
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// Sinkronisasi database dan server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
