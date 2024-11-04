const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authorRoutes = require('./routes/author');
const genreRoutes = require('./routes/genre');
const supplierRoutes = require('./routes/supplier');
const bookRoutes = require('./routes/book'); 

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors());


app.use(cookieParser());

app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/books', bookRoutes); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});


module.exports = app;
