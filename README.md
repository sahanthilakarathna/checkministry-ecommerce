### Requirements
Install these before continuing:
- Node.js (20+)
- PostgreSQL

### DB
Create a new database "ecommerce" in postgresql and create the tables

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    orderDescription VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    productName VARCHAR(100) NOT NULL,
    productDescription TEXT
);

CREATE TABLE OrderProductMap (
    orderId INT NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    productId INT NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    PRIMARY KEY (orderId, productId)
);



### .env
DATABASE_URL=postgresql://neondb_owner:npg_3WQhVtKPJzn8@ep-tiny-haze-aec64ubm-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=4000

### Frontend
cd client
npm install
npm run dev

### Backend
cd server
npm install
node seedProducts.js 
npm run dev
