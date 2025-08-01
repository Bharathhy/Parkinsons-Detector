# Product Management System

A modern, full-stack web application for managing product details and descriptions. Built with Node.js/Express backend and vanilla JavaScript frontend.

## Features

### Backend Features
- **RESTful API** with Express.js
- **CRUD Operations** for products (Create, Read, Update, Delete)
- **Data Validation** with proper error handling
- **In-memory Storage** (easily extendable to database)
- **CORS Support** for cross-origin requests

### Frontend Features
- **Modern, Responsive Design** with CSS Grid and Flexbox
- **Real-time Updates** with dynamic product display
- **Form Validation** with visual feedback
- **Modal Dialogs** for editing products
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Mobile-First Design** with responsive breakpoints

### Product Management
- Add new products with name, description, price, category, and image
- Edit existing products with inline form
- Delete products with confirmation
- View all products in a beautiful grid layout
- Automatic image fallback for broken URLs
- Real-time product count display

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and go to: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update existing product |
| DELETE | `/api/products/:id` | Delete product |

### Example API Usage

**Add a Product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "description": "This is a sample product description",
    "price": 29.99,
    "category": "Electronics",
    "image": "https://example.com/image.jpg"
  }'
```

**Get All Products:**
```bash
curl http://localhost:3000/api/products
```

## Project Structure

```
├── server.js              # Express server and API routes
├── package.json           # Project dependencies
├── public/                # Frontend files
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript functionality
└── README.md              # Project documentation
```

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Body-Parser** - Request body parsing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **JavaScript (ES6+)** - Client-side functionality
- **Font Awesome** - Icons
- **Fetch API** - HTTP requests

## Development Features

- **Hot Reloading** with nodemon
- **Error Handling** throughout the application
- **Input Validation** on both frontend and backend
- **Responsive Design** for all device sizes
- **Accessibility** features with proper ARIA labels
- **Security** considerations with input sanitization

## Sample Data

The application comes with 2 sample products pre-loaded:
- Sample Product 1 (Electronics)
- Sample Product 2 (Home & Garden)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

---

## Getting Started

1. Clone or download this project
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server
4. Open `http://localhost:3000` in your browser
5. Start adding your products!

The backend provides a RESTful API, and the frontend automatically updates when you add, edit, or delete products. All data is stored in memory, so it will reset when you restart the server (perfect for testing and development).
