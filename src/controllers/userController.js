const User = require("../models/user");

exports.createUser = async (req, res) => {
    const { name, phoneNo, amount, status } = req.body;
    try {
        const existingUser = await User.findOne({ phoneNo });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({
            name,
            phoneNo,
            amount,
            status
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
    const { name, phoneNo, amount, status } = req.body;
    try {
        const users = await User.findByIdAndUpdate(id, { name, phoneNo, amount, status }, { new: true });
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(users);
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
        const randomIndex = Math.floor(
            Math.random() * pendingUsers.length
        );

        const randomUser = pendingUsers[randomIndex];


        await User.updateOne(
            { _id: randomUser._id },
            { status: "Selected" }
        );

        res.status(200).json({
            message: "User selected successfully",
            user: randomUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}