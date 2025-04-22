const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const router = express.Router();

const Category = require("../model/category");
const { protectAdmin } = require("../middleware/protectAdmin");



router.post("/category-create", protectAdmin, async (req, res) => {
    try {
        const { categoryName, categoryShortform } = req.body;
    
        if (!categoryName || !categoryShortform) {
          return res.status(400).json({ message: 'All fields are required' });
        }
    
        const existing = await Category.findOne({ categoryShortform: categoryShortform.toUpperCase() });
        if (existing) {
          return res.status(400).json({ message: 'Category shortform already exists' });
        }
    
        const category = await Category.create({
          categoryName,
          categoryShortform: categoryShortform.toUpperCase(),
        });
    
        res.status(201).json(category);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});


// Get all categories
router.get("/all-categories", async (req, res) => {

    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.status(200).json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

  
  // Update a category
  router.put("/update-category/:id", protectAdmin, async (req, res) => {

    try {
      const { categoryName, categoryShortform } = req.body;
      const { id } = req.params;
  
      if (!categoryName || !categoryShortform) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const updated = await Category.findByIdAndUpdate(
        id,
        {
          categoryName,
          categoryShortform: categoryShortform.toUpperCase(),
        },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category updated', category: updated });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

  // Delete a category
  router.delete("/delete-category/:id", protectAdmin, async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await Category.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;