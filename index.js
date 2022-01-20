const express = require('express');
const app = express();
const port = process.env.port || 3000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const customersRoute = require('./routes/customerRoute');
const productsRoute = require('./routes/productRoute');
const stockRoute = require('./routes/stockRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const customerStatementRoute = require('./routes/customerStatementRoute');
const salaryRoute = require('./routes/salaryRoute');

dotenv.config();

//conenct to db
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log("Connected from whitelisted IP.");
});

//Middleware
app.use(express.json());

//route middlewares
app.use('/api/user', authRoute);
app.use('/api/salary', salaryRoute);
app.use('/api/posts', postRoute);
app.use('/api/customers', customersRoute);
app.use('/api/products', productsRoute);
app.use('/api/stock', stockRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/customer_statements', customerStatementRoute);

app.listen(port, () => {
    console.log(/*`Server running on http://localhost:${port}`*/);
})