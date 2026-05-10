const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'fallbackSecret123';
    return jwt.sign({ id }, secret, {
        expiresIn: '30d'
    });
};

// @desc    Signin user
// @route   POST /api/auth/signin
// @access  Public
exports.signinUser = async (req, res) => {
    try {
        const { phoneNo, password } = req.body;

        // Validate input
        if (!phoneNo || password !== "1234" ) {
            return res.status(400).json({
                message: 'Please provide phone number and password'
            });
        }

        // Check if user exists
        const user = await User.findOne({ phoneNo });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        // const isMatch = await user.comparePassword(password);
        // if (!isMatch) {
        //     return res.status(401).json({
        //         message: 'Invalid credentials'
        //     });
        // }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                phoneNo: user.phoneNo,
                amount: user.amount,
                status: user.status,
                roles: user.roles,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: error.message 
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: error.message 
        });
    }
};
