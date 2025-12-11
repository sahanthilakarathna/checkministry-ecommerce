// seedProducts.js
const db = require('./db');

const products = [
  { productName: 'HP laptop', productDescription: 'This is HP laptop' },
  { productName: 'Lenovo laptop', productDescription: 'This is Lenovo laptop' },
  { productName: 'Car', productDescription: 'This is Car' },
  { productName: 'Bike', productDescription: 'This is Bike' }
];

async function seed() {
  try {
    for (const product of products) {
      await db.query(
        'INSERT INTO Products (productName, productDescription) VALUES ($1, $2)',
        [product.productName, product.productDescription]
      );
    }
    console.log('Products seeded successfully!');
  } catch (err) {
    console.error('Error seeding products:', err);
  } finally {
    db.pool.end();
  }
}

seed();
