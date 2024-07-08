const { Op } = require('sequelize');
const Product = require('../models/product');
const Category = require('../models/category');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../config/database');

// GET ALL PRODUCT WITH CATEGORY
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [{ // JOIN TABLE PRODUCT & CATEGORY
          model: Category,
          as: 'category',
          attributes: ['name'] 
        }],
        attributes: ['id', 'name', 'price', 'description', 'created_at', 'updated_at', 'images', 'CategoryId']
      });
  
      const modifiedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name, 
        description: product.description,
        images: product.images,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }));
  
      res.status(200).json({ success: "OK", message: 'Products fetched successfully', data: modifiedProducts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.path : null;
  
    const t = await sequelize.transaction(); // Start transaksi
  
    try {
      const foundCategory = await Category.findOne({
        where: {
          name: {
            [Op.like]: `%${category}%`
          }
        },
        transaction: t
      });
  
      if (!foundCategory) {
        await t.rollback(); // membatalkan transaksi jika kategori tidak ditemukan
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      }
  
      const product = await Product.create({
        name,
        price,
        description,
        images: image,
        CategoryId: foundCategory.id
      }, { transaction: t }); 

      await t.commit(); // Commit transaksi 
  
      const responseData = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category_id: product.CategoryId,
        images: product.images,
        created_at: product.created_at,
        updated_at: product.updated_at
      };
  
      res.status(201).json({ success: "OK", message: 'Product created successfully', data: responseData });
    } catch (error) {
      console.error(error);
      await t.rollback(); // Rollback transaksi jika terjadi kesalahan
      res.status(500).json({ error: error.message });
    }
  };
  
  // UPDATE PRODUCT
  exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.path : null;
  
    const t = await sequelize.transaction(); // Mulai transaksi
  
    try {
      const product = await Product.findByPk(productId, { transaction: t });
  
      if (!product) {
        await t.rollback(); // Membatalkan transaksi jika produk tidak ditemukan
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
      }
  
      const foundCategory = await Category.findOne({
        where: {
          name: {
            [Op.like]: `%${category}%`
          }
        },
        transaction: t 
      });
  
      if (!foundCategory) {
        await t.rollback(); // Membatalkan transaksi jika produk tidak ditemukan
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      }
  
      if (image && product.images) {
        fs.unlinkSync(product.images); // Menghapus gambar lama jika ada
      }
  
      product.name = name;
      product.price = price;
      product.description = description;
      product.images = image || product.images; 
      product.CategoryId = foundCategory.id;
  
      await product.save({ transaction: t }); 
  
      await t.commit(); // Commit transaksi
  
      res.status(200).json({ success: "OK", message: 'Product updated successfully', data: product });
    } catch (error) {
      console.error(error);
      await t.rollback(); // Rollback transaksi 
      res.status(500).json({ error: error.message });
    }
  };

// DELETE PRODUCT 
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    if (product.images) {
      fs.unlinkSync(product.images); 
    }

    await product.destroy();

    res.status(200).json({ message: 'Success delete product' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

