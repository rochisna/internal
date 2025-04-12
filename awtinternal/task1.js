const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/it-b').then(()=>{console.log('connected')})
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 }
});
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            const token = 'Token'; 
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid ');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (product) {
            res.status(200).send('Product delete');
        } else {
            res.status(404).send(' not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
});