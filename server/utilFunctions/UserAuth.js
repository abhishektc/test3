const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET } = require("../config/config");
const { Timestamp } = require("mongodb");

const userRegister = async (data, role, res) => {

    try {

        let usernameNotTaken = await validateUsername(data.username);

        if (!usernameNotTaken) {

            return res.status(400).json({
                error: `USERNAME_EXIST`,
                success: false
            });

        }

        const password = await bcrypt.hash(data.password, 12);

        const newUser = new User({
            ...data,
            password,
            role
        });

        await newUser.save();

        return res.status(201).json({
            message: "Registered Successfully",
            success: true
        });

    } catch (err) {

        return res.status(500).json({
            error: "Register Failed",
            success: false
        });

    }
};


const userLogin = async (data, res) => {

    try {
        let { username, password } = data;
        const user = await User.findOne({ username });

        if (!user) {

            return res.status(404).json({
                error: "USERNAME_NOT_FOUND",
                success: false
            });

        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            let token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    role: user.role,
                },
                SECRET,
                { expiresIn: "5h" }
            );

            const decodeToken = jwt.decode(token);

            let result = {
                id: user._id,
                username: user.username,
                role: user.role,
                token: token,
                expiresIn: decodeToken.exp * 1000
            };

            return res.status(200).json({
                result: result,
                message: "Logged in successfully",
                success: true
            });

        } else {

            return res.status(403).json({
                error: "INVALID_PASSWORD",
                success: false
            });

        }
    } catch (error) {

        return res.status(500).json({
            error: "Login Failed",
            success: false
        });

    }

};

const editCustomer = async (req, res) => {

    try {

        const user = await User.updateOne({ _id: req.params.id }, { $set: { name: req.body.name, phone: req.body.phone } });

        return res.status(200).json({
            message: "Customer updated successfully",
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const validateUsername = async username => {

    let user = await User.findOne({ username });
    return user ? false : true;

};

module.exports = {
    userRegister,
    userLogin,
    editCustomer,
};
