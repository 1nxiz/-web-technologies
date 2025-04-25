
const appState = {
    products: [],
    activeFilter: 'all',
    activeSort: null,
    productToDeleteId: null
};

const CATEGORIES = {
    all: 'Всі',
    electronics: 'Електроніка',
    clothing: 'Одяг',
    food: 'Харчування',
    household: 'Побутові товари'
};

const createElement = (tag, attributes = {}, textContent = '') => {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'classList' && Array.isArray(value)) {
            value.forEach(className => element.classList.add(className));
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
};

const createProductCard = (product) => {
    const card = createElement('div', { classList: ['product-card'] });
    
    const img = createElement('img', { 
        src: product.image, 
        alt: product.name,
        classList: ['product-image']
    });
    
    const infoDiv = createElement('div', { classList: ['product-info'] });
    
    const titleDiv = createElement('div', { classList: ['product-title'] }, product.name);
    
    const priceDiv = createElement('div', { classList: ['product-price'] }, `${product.price.toFixed(2)} грн`);
    
    const categoryDiv = createElement('div', { classList: ['product-category'] }, CATEGORIES[product.category] || product.category);
    
    const idDiv = createElement('div', { classList: ['product-id'] }, `ID: ${product.id}`);
    
    const actionsDiv = createElement('div', { classList: ['card-actions'] });
    
    const editBtn = createElement('button', { 
        classList: ['edit-btn'], 
        'data-id': product.id 
    }, 'Редагувати');
    editBtn.addEventListener('click', () => openEditModal(product.id));
    
    const deleteBtn = createElement('button', { 
        classList: ['delete-btn'], 
        'data-id': product.id 
    }, 'Видалити');
    deleteBtn.addEventListener('click', () => openDeleteModal(product.id));
    
    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(priceDiv);
    infoDiv.appendChild(categoryDiv);
    infoDiv.appendChild(idDiv);
    
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    
    card.appendChild(img);
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);
    
    return card;
};

const filterProductsByCategory = (products, category) => {
    if (category === 'all') {
        return [...products];
    }
    return products.filter(product => product.category === category);
};

const sortProducts = (products, sortType) => {
    if (!sortType) return [...products];
    
    const sortedProducts = [...products];
    
    switch (sortType) {
        case 'price':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'created':
            return sortedProducts.sort((a, b) => new Date(a.created) - new Date(b.created));
        case 'updated':
            return sortedProducts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        default:
            return sortedProducts;
    }
};

const calculateTotalPrice = (products) => {
    return products.reduce((total, product) => total + product.price, 0);
};

const generateId = () => {
    return Date.now().toString();
};

const createProduct = (name, price, category, image) => {
    const timestamp = new Date().toISOString();
    return {
        id: generateId(),
        name,
        price: parseFloat(price),
        category,
        image,
        created: timestamp,
        updated: timestamp
    };
};

const updateProduct = (product, updatedData) => {
    return {
        ...product,
        ...updatedData,
        updated: new Date().toISOString()
    };
};

const renderProductList = () => {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';
    
    const filteredProducts = filterProductsByCategory(appState.products, appState.activeFilter);
    
    const sortedProducts = sortProducts(filteredProducts, appState.activeSort);
    
    if (sortedProducts.length === 0) {
        const emptyMessage = createElement('div', { classList: ['empty-message'] }, 
            'Наразі список товарів пустий. Додайте новий товар.');
        productListElement.appendChild(emptyMessage);
    } else {
        sortedProducts.forEach(product => {
            const card = createProductCard(product);
            productListElement.appendChild(card);
        });
    }
    
    updateTotalPriceDisplay();
};

const updateTotalPriceDisplay = () => {
    const totalPriceElement = document.getElementById('total-price');
    const totalPrice = calculateTotalPrice(appState.products);
    totalPriceElement.textContent = totalPrice.toFixed(2);
};

const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
};

const closeModal = (modal) => {
    modal.classList.remove('active');
};

const showSnackbar = (message) => {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.classList.add('show');
    
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
};

const openEditModal = (productId) => {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modal-title').textContent = 'Редагування товару';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    
    openModal('product-modal');
};

const openDeleteModal = (productId) => {
    appState.productToDeleteId = productId;
    openModal('delete-modal');
};

const addProductToState = (product) => {
    appState.products = [...appState.products, product];
    renderProductList();
    showSnackbar(`Товар "${product.name}" успішно додано!`);
};

const updateProductInState = (productId, updatedData) => {
    const productIndex = appState.products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const updatedProduct = updateProduct(appState.products[productIndex], updatedData);
    
    appState.products = [
        ...appState.products.slice(0, productIndex),
        updatedProduct,
        ...appState.products.slice(productIndex + 1)
    ];
    
    renderProductList();
    showSnackbar(`Товар ID: ${productId}. ${updatedProduct.name} успішно оновлено!`);
};

const removeProductFromState = (productId) => {
    const productToDelete = appState.products.find(p => p.id === productId);
    if (!productToDelete) return;
    
    const productCard = document.querySelector(`.product-card .delete-btn[data-id="${productId}"]`)
        ?.closest('.product-card');
    
    if (productCard) {
        productCard.classList.add('removing');
        
        setTimeout(() => {
            appState.products = appState.products.filter(p => p.id !== productId);
            renderProductList();
            showSnackbar(`Товар "${productToDelete.name}" успішно видалено!`);
        }, 500);
    } else {
        appState.products = appState.products.filter(p => p.id !== productId);
        renderProductList();
        showSnackbar(`Товар "${productToDelete.name}" успішно видалено!`);
    }
};


const handleProductFormSubmit = (event) => {
    event.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    
    if (productId) {
        updateProductInState(productId, { name, price: parseFloat(price), category, image });
    } else {
        const newProduct = createProduct(name, price, category, image);
        addProductToState(newProduct);
    }
    
    closeModal(document.getElementById('product-modal'));
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
};

const setActiveFilter = (category) => {
    appState.activeFilter = category;
    
    const filterButtons = document.querySelectorAll('#category-filters button');
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.category === category);
    });
    
    renderProductList();
};

const setActiveSort = (sortType) => {
    appState.activeSort = sortType;
    
    const sortButtons = document.querySelectorAll('.sort-buttons button');
    sortButtons.forEach(button => {
        if (button.id === 'reset-sort') return;
        button.classList.toggle('active', button.id.includes(sortType));
    });
    
    renderProductList();
};

const deleteProduct = () => {
    const productId = appState.productToDeleteId;
    if (productId) {
        removeProductFromState(productId);
        closeModal(document.getElementById('delete-modal'));
        appState.productToDeleteId = null;
    }
};

const toggleMenu = () => {
    const popupMenu = document.getElementById('popup-menu');
    popupMenu.classList.toggle('active');
};

const initializeCategoryFilters = () => {
    const categoryFiltersContainer = document.getElementById('category-filters');
    
    categoryFiltersContainer.innerHTML = '';
    
    Object.entries(CATEGORIES).forEach(([category, label]) => {
        const button = createElement('button', { 
            classList: ['outline'],
            'data-category': category
        }, label);
        
        if (category === 'all') {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => setActiveFilter(category));
        
        categoryFiltersContainer.appendChild(button);
    });
};

const initializeSortButtons = () => {
    document.getElementById('sort-by-price').addEventListener('click', () => setActiveSort('price'));
    document.getElementById('sort-by-created').addEventListener('click', () => setActiveSort('created'));
    document.getElementById('sort-by-updated').addEventListener('click', () => setActiveSort('updated'));
    document.getElementById('reset-sort').addEventListener('click', () => {
        appState.activeSort = null;
        document.querySelectorAll('.sort-buttons button').forEach(btn => {
            if (btn.id !== 'reset-sort') btn.classList.remove('active');
        });
        renderProductList();
    });
};

const initializeModals = () => {
    document.getElementById('add-product-btn').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Додавання товару';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        openModal('product-modal');
    });
    
    document.getElementById('confirm-delete').addEventListener('click', deleteProduct);
    
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
};


const saveToLocalStorage = () => {
    localStorage.setItem('productManagerData', JSON.stringify({
        products: appState.products
    }));
};

const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('productManagerData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        appState.products = parsedData.products || [];
        renderProductList();
        return true;
    }
    return false;
};

const initializeApp = () => {
    initializeCategoryFilters(); 
    initializeSortButtons();
        initializeModals();
    
    const dataLoaded = loadFromLocalStorage();
    
    if (!dataLoaded) {
        loadDemoProducts();
    }
    
    renderProductList();
    
    window.addEventListener('beforeunload', saveToLocalStorage);
};

document.addEventListener('DOMContentLoaded', initializeApp);