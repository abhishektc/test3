const Loan = require("../models/Loan");
const User = require("../models/User");

const loanRequest = async (data, res) => {

    try {
        const state = 'NEW';
        const newLoan = new Loan({
            ...data,
            state
        });

        await newLoan.save();

        return res.status(201).json({
            message: "Loan Requested Successfully",
            success: true
        });

    } catch (err) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }
};


const getCustomers = async (data, res) => {

    try {

        const customer = await User.find({ role: 'CUSTOMER' }).select('name phone');

        return res.status(200).json({
            result: customer,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const loanListById = async (req, res) => {

    try {

        var sort = { _id: -1 };
        const loanList = await Loan.find({ agentId: req.params.id }).populate('user').populate({ path: 'customerId', select: 'name phone -_id' }).select('-agentId').sort(sort);

        return res.status(200).json({
            result: loanList,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const loanListByCustomerId = async (req, res) => {

    try {

        var sort = { _id: -1 };
        const loanList = await Loan.find({ customerId: req.params.id }).populate('user').populate({ path: 'agentId', select: 'name phone -_id' }).select('-customerId').sort(sort);

        return res.status(200).json({
            result: loanList,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const allLoanList = async (req, res) => {

    try {

        var sort = { _id: -1 };
        const loanList = await Loan.find().populate('user').populate({ path: 'customerId agentId', select: 'name phone -_id' }).sort(sort);
        
        return res.status(200).json({
            result: loanList,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const getLoanById = async (req, res) => {

    try {

        const loan = await Loan.find({ _id: req.params.id });
        const customer = await User.find({ role: 'CUSTOMER' }).select('name phone');

        return res.status(200).json({
            customer:customer,
            result: loan,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const getCustomerById = async (req, res) => {

    try {

        const user = await User.find({ _id: req.params.id }).select('name phone');

        return res.status(200).json({
            result: user,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const editLoanRequest = async (req, res) => {

    try {

        let validateStates = await validateState(req.params.id);

        if (!validateStates) {
            return res.status(400).json({
                error: `CAN_NOT_UPDATE`,
                success: false
            });

        }

        const loan = await Loan.updateOne({ _id: req.params.id }, { $set: { amount: req.body.amount, intrest: req.body.intrest, month: req.body.month, customerId: req.body.customerId, totalIntrest: req.body.totalIntrest, emi: req.body.emi } });

        return res.status(200).json({
            message: "Loan updated successfully",
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const updateLoanState = async (req, res) => {

    try {

        const loan = await Loan.updateOne({ _id: req.params.id }, { $set: { state: req.body.state } });

        return res.status(200).json({
            message: "Loan state updated successfully",
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: "FAILED",
            success: false
        });

    }

};

const validateState = async id => {

    let loan = await Loan.findOne({ _id: id });

    return loan.state === 'NEW' ? true : false;

};

module.exports = {
    loanRequest,
    getCustomers,
    loanListById,
    allLoanList,
    getLoanById,
    editLoanRequest,
    getCustomerById,
    loanListByCustomerId,
    updateLoanState
};
