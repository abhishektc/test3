const { SECRET } = require("../config/config");
const jwt = require("jsonwebtoken");
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(409).json({
                        success: false,
                        message: "Invalid Token..."
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(409).json({
                success: false,
                message: "Access Denied! Unauthorized User"
            });
        }
    },
    checkTokenAGENTandADMIN: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(409).json({
                        success: false,
                        message: "Invalid Token..."
                    });
                } else {
                    req.decoded = decoded;
                    if (req.decoded.role === 'AGENT' || req.decoded.role === 'ADMIN') {
                        next();
                    } else {
                        return res.status(409).json({
                            success: false,
                            message: "Access Denied! Unauthorized User"
                        });
                    }
                }
            });
        } else {
            return res.status(409).json({
                success: false,
                message: "Access Denied! Unauthorized User"
            });
        }
    },

    checkTokenAGENT: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(409).json({
                        success: false,
                        message: "Invalid Token..."
                    });
                } else {
                    req.decoded = decoded;
                    if (req.decoded.role === 'AGENT') {
                        next();
                    } else {
                        return res.status(409).json({
                            success: false,
                            message: "Access Denied! Unauthorized User"
                        });
                    }
                }
            });
        } else {
            return res.status(409).json({
                success: false,
                message: "Access Denied! Unauthorized User"
            });
        }
    },

    checkTokenADMIN: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(409).json({
                        success: false,
                        message: "Invalid Token..."
                    });
                } else {
                    req.decoded = decoded;
                    if (req.decoded.role === 'ADMIN') {
                        next();
                    } else {
                        return res.status(409).json({
                            success: false,
                            message: "Access Denied! Unauthorized User"
                        });
                    }
                }
            });
        } else {
            return res.status(409).json({
                success: false,
                message: "Access Denied! Unauthorized User"
            });
        }
    }


};
