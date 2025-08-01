// API Base URL
const API_BASE = '/api/products';

// DOM Elements
const productForm = document.getElementById('productForm');
const editProductForm = document.getElementById('editProductForm');
const productsGrid = document.getElementById('productsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const noProducts = document.getElementById('noProducts');
const productCount = document.getElementById('productCount');
const toastContainer = document.getElementById('toastContainer');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelEdit = document.getElementById('cancelEdit');

// State
let products = [];
let isEditing = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Form submissions
    productForm.addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleEditProduct);
    
    // Modal controls
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', clearForm);
    
    // Close modal when clicking outside
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && editModal.style.display === 'block') {
            closeEditModal();
        }
    });
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load all products
async function loadProducts() {
    showLoading(true);
    
    try {
        const response = await apiRequest(API_BASE);
        products = response.data || [];
        displayProducts();
        updateProductCount();
        showToast('Products loaded successfully', 'success');
    } catch (error) {
        showToast('Failed to load products: ' + error.message, 'error');
        displayProducts(); // Show empty state
    } finally {
        showLoading(false);
    }
}

// Add new product
async function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(productForm);
    const productData = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!productData.name.trim() || !productData.description.trim()) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    submitBtn.disabled = true;
    
    try {
        const response = await apiRequest(API_BASE, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        
        products.push(response.data);
        displayProducts();
        updateProductCount();
        clearForm();
        showToast(response.message || 'Product added successfully', 'success');
    } catch (error) {
        showToast('Failed to add product: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Populate edit form
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductImage').value = product.image;
    
    // Show modal
    editModal.style.display = 'block';
    isEditing = true;
}

// Handle edit form submission
async function handleEditProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(editProductForm);
    const productData = Object.fromEntries(formData.entries());
    const productId = document.getElementById('editProductId').value;
    
    // Validate required fields
    if (!productData.name.trim() || !productData.description.trim()) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const submitBtn = editProductForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    submitBtn.disabled = true;
    
    try {
        const response = await apiRequest(`${API_BASE}/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
        
        // Update product in local array
        const index = products.findIndex(p => p.id == productId);
        if (index !== -1) {
            products[index] = response.data;
            displayProducts();
        }
        
        closeEditModal();
        showToast(response.message || 'Product updated successfully', 'success');
    } catch (error) {
        showToast('Failed to update product: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await apiRequest(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        // Remove product from local array
        products = products.filter(p => p.id !== id);
        displayProducts();
        updateProductCount();
        showToast(response.message || 'Product deleted successfully', 'success');
    } catch (error) {
        showToast('Failed to delete product: ' + error.message, 'error');
    }
}

// Display products in grid
function displayProducts() {
    if (products.length === 0) {
        productsGrid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    noProducts.style.display = 'none';
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x200/f0f0f0/666?text=No+Image'">
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-title">${escapeHtml(product.name)}</h3>
                    ${product.price ? `<span class="product-price">$${parseFloat(product.price).toFixed(2)}</span>` : ''}
                </div>
                ${product.category ? `<div class="product-category">${escapeHtml(product.category)}</div>` : ''}
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div class="product-actions">
                    <button class="btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

function updateProductCount() {
    const count = products.length;
    productCount.textContent = `${count} Product${count !== 1 ? 's' : ''}`;
}

function clearForm() {
    productForm.reset();
    productForm.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
        .forEach(field => {
            field.classList.remove('error');
        });
}

function closeEditModal() {
    editModal.style.display = 'none';
    isEditing = false;
    editProductForm.reset();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                type === 'error' ? 'fas fa-exclamation-circle' : 
                'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }, 4000);
}

// Add slideOut animation to CSS (if not already present)
if (!document.querySelector('style[data-toast]')) {
    const style = document.createElement('style');
    style.setAttribute('data-toast', 'true');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Handle image load errors
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('product-image')) {
        e.target.src = 'https://via.placeholder.com/300x200/f0f0f0/666?text=No+Image';
    }
}, true);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (isEditing) {
            editProductForm.dispatchEvent(new Event('submit'));
        } else {
            productForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-resize textareas
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});

// Form validation visual feedback
document.addEventListener('blur', function(e) {
    if (e.target.matches('input[required], textarea[required]')) {
        if (!e.target.value.trim()) {
            e.target.style.borderColor = '#dc3545';
        } else {
            e.target.style.borderColor = '#4CAF50';
        }
    }
}, true);

document.addEventListener('input', function(e) {
    if (e.target.matches('input[required], textarea[required]')) {
        if (e.target.value.trim()) {
            e.target.style.borderColor = '#4CAF50';
        } else {
            e.target.style.borderColor = '#dc3545';
        }
    }
}, true);