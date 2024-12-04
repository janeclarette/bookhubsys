const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const authorRoutes = require('./routes/author');
const genreRoutes = require('./routes/genre');
const supplierRoutes = require('./routes/supplier');
const bookRoutes = require('./routes/book'); 
const auth = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/review'); 


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,               
};
app.use(cors(corsOptions)); 

app.use(cookieParser());




app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/v1', auth);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes); 



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
