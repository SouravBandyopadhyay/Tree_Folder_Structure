import express from "express";
import pool from "./database.js";
import cors from "cors";
const app = express();
app.use(cors());
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const buildTree = (categories, parentId = null) => {
  const tree = [];
  categories
    .filter((category) => category.parent === parentId)
    .forEach((category) => {
      const children = buildTree(categories, category.category_id);
      const node = {
        label: category.label,
        value: category.category_id.toString(),
        children: children.length ? children : undefined,
      };
      tree.push(node);
    });
  return tree;
};
// Route to fetch all categories
app.get("/categories", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM category");
    connection.release();
    const data = buildTree(rows);

    res.json(data);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a new category
app.post("/add-categories", async (req, res) => {
  const { name, parent } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      "INSERT INTO category (name, parent) VALUES (?, ?)",
      [name, parent || null]
    );
    connection.release();
    res.status(201).json({ id: result.insertId, name, parent });
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch child categories for a given parent category ID
app.get("/categories/:parentId", async (req, res) => {
  const { parentId } = req.params;
  if (!parentId || isNaN(parseInt(parentId))) {
    return res.status(400).json({ error: "Invalid parent ID" });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM category WHERE parent = ?",
      [parentId]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving child categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SECTION Create New Folder
app.post("/categories/:parentId/new", async (req, res) => {
  const { parentId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      "INSERT INTO category (label, parent) VALUES (?, ?)",
      [name, parentId || null]
    );
    connection.release();
    res
      .status(201)
      .json({ category_id: result.insertId, name, parent: parentId });
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SECTION Delete Folder
// Route to delete a category
app.delete("/categories/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  // Prevent deletion of root folders or folders with parent ID null or 1
  if (categoryId === "1" || categoryId === null) {
    return res
      .status(400)
      .json({
        error: "Cannot delete root folder or folders with parent ID null",
      });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      "DELETE FROM category WHERE category_id = ?",
      [categoryId]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: `Category with ID ${categoryId} not found` });
    }

    res.status(200).json({ message: `Category with ID ${categoryId} deleted` });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
