const User = require("../models/user");

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    const { name, phoneNo, chitNo, password, amount, status, roles } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ phoneNo }, { chitNo }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({
            name,
            phoneNo,
            chitNo,
            amount,
            status,
            roles
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.findById(id);
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phoneNo, chitNo, amount, status, roles } = req.body;
    try {
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if chitNo is being changed and if it's already taken
        if (chitNo !== undefined && chitNo !== existingUser.chitNo) {
            const chitNoExists = await User.findOne({ chitNo, _id: { $ne: id } });
            if (chitNoExists) {
                return res.status(400).json({ message: "Chit number already exists" });
            }
        }

        // Prepare update object
        const updateData = { name, phoneNo, chitNo, status, roles };
        
        // Track amount changes
        if (amount !== undefined && amount !== existingUser.amount) {
            updateData.amount = amount;
            updateData.lastAmountUpdate = new Date();
            
            // Add to amount history
            updateData.$push = {
                amountHistory: {
                    amount: amount,
                    updatedAt: new Date(),
                    updatedBy: req.user.id
                }
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('amountHistory.updatedBy', 'name');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.findByIdAndDelete(id);
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.pickRandomUser = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: "Pending" });
        if (pendingUsers.length === 0) {
            return res.status(400).json({
                message: "No pending users available"
            });
        }
        
        // Get current selection round (increment from max existing round)
        const maxRoundResult = await User.aggregate([
            { $unwind: '$selectionHistory' },
            { $group: { _id: null, maxRound: { $max: '$selectionHistory.selectionRound' } } }
        ]);
        const nextRound = (maxRoundResult[0]?.maxRound || 0) + 1;

        const randomIndex = Math.floor(
            Math.random() * pendingUsers.length
        );

        const randomUser = pendingUsers[randomIndex];

        // Update user with selection history
        const updatedUser = await User.findByIdAndUpdate(
            randomUser._id,
            { 
                status: "Selected",
                lastSelectionDate: new Date(),
                $inc: { totalSelections: 1 },
                $push: {
                    selectionHistory: {
                        selectedAt: new Date(),
                        selectedBy: req.user.id,
                        selectionRound: nextRound
                    }
                }
            },
            { new: true }
        ).populate('selectionHistory.selectedBy', 'name');

        res.status(200).json({
            message: "User selected successfully",
            user: updatedUser,
            selectionRound: nextRound
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get user with detailed history
// @route   GET /api/users/:id/history
// @access  Private/Admin
exports.getUserWithHistory = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('amountHistory.updatedBy', 'name')
            .populate('selectionHistory.selectedBy', 'name');
            
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                phoneNo: user.phoneNo,
                chitNo: user.chitNo,
                amount: user.amount,
                status: user.status,
                roles: user.roles,
                createdAt: user.createdAt,
                lastAmountUpdate: user.lastAmountUpdate,
                lastSelectionDate: user.lastSelectionDate,
                totalSelections: user.totalSelections,
                amountHistory: user.amountHistory,
                selectionHistory: user.selectionHistory
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}