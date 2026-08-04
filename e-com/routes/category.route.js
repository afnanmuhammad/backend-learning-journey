import express from "express";
import { Category } from "../models/category.model.js";
import { adminOnly } from "../middleware/roles.middleware.js";

const router = express.Router();

// Create Category
router.post("/", adminOnly, async (req, res) => {
  if (!req.body.name || req.body.name.trim().length < 3) {
    return res.status(400).send({
      message: req.t("categoryNamevalidation"),
    });
  }

  try {
    const newCategory = await Category.create({
      name: req.body.name,
    });

    return res.status(201).send(newCategory);
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
});

// Get All Categories
router.get("/", async (req, res) => {
  try {
    const categoriesList = await Category.find();

    if (!categoriesList || categoriesList.length === 0) {
      return res.status(404).send({
        message: req.t("noCategories"),
      });
    }

    return res.status(200).send(categoriesList);
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
});

// Delete Category
router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deleteCategory) {
      return res.status(404).send({
        message: req.t("categoryNotFound"),
      });
    }

    return res.status(200).send({
      message: req.t("categoryDeletedSuccessfully"),
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
});

// Update Category
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      },
    );

    if (!updatedCategory) {
      return res.status(404).send({
        message: req.t("categoryNotFound"),
      });
    }

    return res.status(200).send(updatedCategory);
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
});

export default router;
