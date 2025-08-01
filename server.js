const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// In-memory storage for products (in production, you'd use a database)
let products = [
  {
    id: 1,
    name: "Sample Product 1",
    description: "This is a sample product description for demonstration purposes.",
    price: 29.99,
    category: "Electronics",
    image: "https://via.placeholder.com/300x200/4CAF50/ffffff?text=Product+1",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Sample Product 2",
    description: "Another sample product with detailed description and features.",
    price: 49.99,
    category: "Home & Garden",
    image: "https://via.placeholder.com/300x200/2196F3/ffffff?text=Product+2",
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products,
    total: products.length
  });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, image } = req.body;
  
  // Basic validation
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name and description are required'
    });
  }
  
  const newProduct = {
    id: nextId++,
    name: name.trim(),
    description: description.trim(),
    price: parseFloat(price) || 0,
    category: category?.trim() || 'Uncategorized',
    image: image?.trim() || `https://via.placeholder.com/300x200/FF9800/ffffff?text=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    data: newProduct,
    message: 'Product added successfully'
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const { name, description, price, category, image } = req.body;
  
  if (name) products[productIndex].name = name.trim();
  if (description) products[productIndex].description = description.trim();
  if (price !== undefined) products[productIndex].price = parseFloat(price) || 0;
  if (category) products[productIndex].category = category.trim();
  if (image) products[productIndex].image = image.trim();
  
  products[productIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: products[productIndex],
    message: 'Product updated successfully'
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedProduct,
    message: 'Product deleted successfully'
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/products`);
});