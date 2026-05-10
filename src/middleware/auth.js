const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        // Verify token
        const secret = process.env.JWT_SECRET || 'fallbackSecret123';
        const decoded = jwt.verify(token, secret);
        
        // Get user from the token
        req.user = await User.findById(decoded.id);
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Access denied. Invalid token.'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            return res.status(403).json({
                message: `User role ${req.user.roles} is not authorized to access this route`
            });
        }
        next();
    };
};
