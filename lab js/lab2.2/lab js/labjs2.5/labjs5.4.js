class Store {
    constructor() {
        this.products = new Map();
        this.orders = new Set();
        this.productHistory = new WeakMap();
        this.users = new WeakSet();
    }

    addProduct(id, name, price, quantity) {
        if (this.products.has(id)) {
            this.showOutput(`Продукт з ID ${id} вже існує.`);
            return false;
        }
        const product = { name, price, quantity };
        this.products.set(id, product);
        this.productHistory.set(product, []);
        this.showOutput(`Продукт ${name} додано з ID ${id}.`);
        this.updateProductList();
        return true;
    }

    removeProduct(id) {
        if (!this.products.has(id)) {
            this.showOutput(`Продукт з ID ${id} не знайдено.`);
            return false;
        }
        const product = this.products.get(id);
        this.products.delete(id);
        this.showOutput(`Продукт ${product.name} видалено.`);
        this.updateProductList();
        return true;
    }

    updateProduct(id, newPrice, newQuantity) {
        if (!this.products.has(id)) {
            this.showOutput(`Продукт з ID ${id} не знайдено.`);
            return false;
        }
        const product = this.products.get(id);
        const history = this.productHistory.get(product);
        history.push({ 
            oldPrice: product.price, 
            oldQuantity: product.quantity,
            date: new Date()
        });
        product.price = newPrice;
        product.quantity = newQuantity;
        this.showOutput(`Інформація про продукт оновлена.`);
        this.updateProductList();
        return true;
    }

    searchProduct(name) {
        for (let [id, product] of this.products) {
            if (product.name.toLowerCase() === name.toLowerCase()) {
                this.showOutput(`
                    Знайдено: 
                    ID: ${id}, 
                    Назва: ${product.name}, 
                    Ціна: ${product.price}, 
                    Кількість: ${product.quantity}
                `);
                return product;
            }
        }
        this.showOutput("Продукт не знайдено.");
        return null;
    }

    placeOrder(productId, quantity) {
        if (!this.products.has(productId)) {
            this.showOutput("Продукт не знайдено.");
            return false;
        }
        const product = this.products.get(productId);
        if (product.quantity < quantity) {
            this.showOutput("Недостатньо товару на складі.");
            return false;
        }
        product.quantity -= quantity;
        const order = { 
            product: product.name, 
            quantity,
            date: new Date()
        };
        this.orders.add(order);
        this.showOutput(`Замовлення на ${quantity} ${product.name} підтверджене.`);
        this.updateProductList();
        return true;
    }

    showOutput(message) {
        const output = document.getElementById('output');
        output.innerHTML += `<p>${message}</p>`;
    }

    updateProductList() {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        for (let [id, product] of this.products) {
            const row = `
                <tr>
                    <td>${id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.quantity}</td>
                </tr>
            `;
            productList.innerHTML += row;
        }
    }
}

const store = new Store();

function addProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = Number(document.getElementById('productPrice').value);
    const quantity = Number(document.getElementById('productQuantity').value);
    
    if (id && name && price >= 0 && quantity >= 0) {
        store.addProduct(id, name, price, quantity);
    } else {
        alert('Введіть коректні дані');
    }
}

function updateProduct() {
    const id = document.getElementById('updateId').value;
    const price = Number(document.getElementById('updatePrice').value);
    const quantity = Number(document.getElementById('updateQuantity').value);
    
    if (id && price >= 0 && quantity >= 0) {
        store.updateProduct(id, price, quantity);
    } else {
        alert('Введіть коректні дані');
    }
}

function deleteProduct() {
    const id = document.getElementById('deleteId').value;
    if (id) {
        store.removeProduct(id);
    } else {
        alert('Введіть ID продукту');
    }
}

function searchProduct() {
    const name = document.getElementById('searchName').value;
    if (name) {
        store.searchProduct(name);
    } else {
        alert('Введіть назву продукту');
    }
}

function placeOrder() {
    const productId = document.getElementById('orderProductId').value;
    const quantity = Number(document.getElementById('orderQuantity').value);
    
    if (productId && quantity > 0) {
        store.placeOrder(productId, quantity);
    } else {
        alert('Введіть коректні дані');
    }
}