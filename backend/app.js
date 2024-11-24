const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authorRoutes = require('./routes/author');
const genreRoutes = require('./routes/genre');
const supplierRoutes = require('./routes/supplier');
const bookRoutes = require('./routes/book'); 
const auth = require('./routes/auth');
const cartRoutes = require('./routes/cart');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration to allow credentials and specific origin
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,               // Allow cookies or credentials
};
app.use(cors(corsOptions)); // Use this CORS configuration

app.use(cookieParser());

app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/books', bookRoutes); 
app.use('/api/v1', auth);
app.use('/api/v1/cart', cartRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
