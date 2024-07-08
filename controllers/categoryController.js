const Category = require('../models/category');

// GET ALL CATEGORY
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ success: "OK", message: 'Categories fetched successfully', data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: "OK", message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id; 
    const { name } = req.body;
  
    try {
      const category = await Category.findByPk(categoryId); 
  
      if (!category) {
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      }
  
      category.name = name;
  
      await category.save();
  
      res.status(200).json({ success: "OK", message: 'Category updated successfully', data: category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const category = await Category.findByPk(categoryId); 
  
      if (!category) {
        return res.status(404).json({ error: 'Category Not Fount' });
      }
  
      await category.destroy(); 
  
      res.status(200).json({ message: 'Success delete category' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};
  