// this file will have a functionalities like addProduct, updateProduct, deleteProduct, displayinProducts by manipulating the product.json file.

// Fetches the whole products.json
export const products = async () => {
    try {
        const response = await fetch('./data/json/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        throw error;
    }
}

// This layer will handle the logic of the application for partitioning the bulk and perishable Items. Then it will push to the repository 

export const getPerishableProducts = async () => {
    const getProducts = await products();
    const perishable = getProducts.filter(products => products.productType === 'PERISHABLE');
    return perishable;
}