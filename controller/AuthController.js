const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');

exports.SingUp = async (req, res) => {
    const { name, email, password, confirm_password, role } = req.body;
    console.log('User:', req.body);
    if (!name || !email || !password || !confirm_password) {
        return res.status(400).json({ error: 'All fields are required' });
    }


    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Password and Confirm Password must match' });
    }

    try {
        const Newuser = await User.create({
            name,
            email,
            password,
            confirm_password,
         
        
        });
        const token = jwt.sign({ id:Newuser._id }, config.TOKEN_SECRET, { expiresIn:config.JWT_EXPIRATION  });

        
        return res.status(201).json({ status: 'success', token, data: { user:Newuser } });
    } catch (error) {
        console.error('User Sign Up Error:', error);
        return res.status(500).json({ error:error.message });
    }
}

exports.login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }


    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, config.TOKEN_SECRET, { expiresIn:config.JWT_EXPIRATION  });
        return res.status(200).json({ status: 'success', token });
    } catch (error) {
        console.error('User Login Error:', error);
        return res.status(500).json({ error:error.message });
    }
}

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'You are not logged in! Please log in to get access.' });
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'The user belonging to this token does no longer exist.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
}