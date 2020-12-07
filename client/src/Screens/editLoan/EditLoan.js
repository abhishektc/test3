import React, { useEffect, useState, useCallback } from 'react'
import { Containers } from '../../components/Container/Container'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as authActions from '../../server/Server';
import validators from './validators';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useParams } from "react-router-dom";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditLoan = props => {
    const { id } = useParams();
    const [loanInfo, setLoanInfo] = useState({ amount: '', intrest: '', month: '', customerId: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(true);
    const [open, setOpen] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [emi, setEMI] = useState();
    const [totalIntrest, setTotalIntrest] = useState();
    const [loanReport, setLoanReport] = useState([]);
    const [totalAmount, setTotalAmount] = useState();
    const [customer, setCustomer] = useState();

    const fetchLoanById = useCallback(async () => {
        setError(null);
        setIsLoading1(true)

        let action = authActions.getLoanById(
            id
        );

        setError(null);

        try {
            const data = await action();
            if (data.success) {
                if (data.success) {
                    setCustomer(data.customer);
                    setLoanInfo({ amount: data.result[0].amount, intrest: data.result[0].intrest, month: data.result[0].month, customerId: data.result[0].customerId });
                    setEMI(data.result[0].emi);
                    setTotalIntrest(data.result[0].totalIntrest);
                    setTotalAmount(data.result[0].amount + data.result[0].totalIntrest);
                }
            }

            setIsLoading1(false)
        } catch (error) {
            setError(error.message)
            setIsLoading1(false)
        }
    }, [id])

    useEffect(() => {
        fetchLoanById().then(() => {
            setIsLoading1(false)
        })

    }, [fetchLoanById])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setIsUpdated(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        let action = authActions.editLoanRequest(
            id,
            loanInfo.amount,
            loanInfo.intrest,
            loanInfo.month,
            loanInfo.customerId,
            totalIntrest,
            emi
        );

        setError(null);

        try {
            const data = await action();
            if (data.success) {
                setOpen(true);
                setIsUpdated(true);
            }

            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
            setOpen(true);
        }
    }
    const handleInputChange = (value, inputPropName) => {

        const newState = Object.assign({}, loanInfo);
        newState[inputPropName] = value;
        setLoanInfo(newState);
        updateValidators(inputPropName, value);

    }


    const updateValidators = (fieldName, value) => {
        validators[fieldName].errors = [];
        validators[fieldName].state = value;
        validators[fieldName].valid = true;
        validators[fieldName].rules.forEach((rule) => {
            if (rule.test instanceof RegExp) {
                if (!rule.test.test(value)) {
                    validators[fieldName].errors.push(rule.message);
                    validators[fieldName].valid = false;
                }
            } else if (typeof rule.test === 'function') {
                if (!rule.test(value)) {
                    validators[fieldName].errors.push(rule.message);
                    validators[fieldName].valid = false;
                }
            }
        });
    }

    const displayValidationErrors = (fieldName) => {
        const validator = validators[fieldName];
        const result = '';
        if (validator && !validator.valid) {
            const errors = validator.errors[0];
            return (
                <FormHelperText style={{ marginLeft: '2%', color: 'red' }}>{errors}</FormHelperText>
            );
        }
        return result;
    }

    const isFormValid = () => {
        let status = true;
        Object.keys(validators).forEach((field) => {
            if (!validators[field].valid) {
                status = false;
            }
        });
        return status;
    }

    function calCulateEMI() {
        if (validators.amount.valid && validators.intrest.valid && validators.month.valid) {
            const month = loanInfo.month;
            const r = loanInfo.intrest / 12 / 100;
            const amount = JSON.parse(loanInfo.amount);
            const emi = amount * r * Math.pow(1 + r, month) / (Math.pow(1 + r, month) - 1);
            setEMI(Math.round(emi));
            let mIntrest = r * amount;
            let paidBalance = emi - mIntrest;
            let loanBalance = amount - paidBalance;
            let data = [];
            let i = 0;
            let totalIntre = 0;
            if (loanBalance < 0) {
                totalIntre = totalIntre + mIntrest;
            }
            while (loanBalance >= -1) {
                let obj = {};
                i++;
                obj['month'] = i;
                obj['loanBalance'] = Math.round(loanBalance);
                data.push(obj);
                totalIntre = totalIntre + mIntrest;
                mIntrest = r * loanBalance;
                paidBalance = emi - mIntrest;
                loanBalance = loanBalance - paidBalance;
            }
            setTotalIntrest(Math.round(totalIntre));
            setLoanReport(data);
            setTotalAmount(amount + Math.round(totalIntre))
        }
    }

    const styles = {
        title: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        formField: { marginLeft: '2%', marginTop: '2%', marginRight: '2%' }
    }

    return (
        <>
            {isLoading1 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={50} color="primary" />
                </div>
            ) : (
                    <>
                        <Containers>
                            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Alert onClose={handleClose} severity="error">
                                    {error}
                                </Alert>
                            </Snackbar>
                            <Snackbar open={isUpdated} autoHideDuration={3000} onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Alert onClose={handleClose} severity="success">
                                    Loan Updated Successfully
                                </Alert>
                            </Snackbar>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} >
                                <Typography style={styles.title} variant="h5" component="h2">
                                    Edit Loan
                                </Typography>
                                <TextField style={styles.formField} label="Amount" id="amount"
                                    required
                                    type="text"
                                    value={loanInfo.amount}
                                    onBlur={calCulateEMI}
                                    onChange={event => handleInputChange(event.target.value, 'amount')} />
                                {displayValidationErrors('amount')}
                                <TextField style={styles.formField} label="Intrest Rate"
                                    required
                                    id="intrest"
                                    type="text"
                                    value={loanInfo.intrest}
                                    onBlur={calCulateEMI}
                                    onChange={event => handleInputChange(event.target.value, 'intrest')}
                                />
                                {displayValidationErrors('intrest')}
                                <TextField style={styles.formField} label="Loan Tenure(in month)" id="month"
                                    required
                                    type="text"
                                    value={loanInfo.month}
                                    onBlur={calCulateEMI}
                                    onChange={event => handleInputChange(event.target.value, 'month')} />
                                {displayValidationErrors('month')}

                                <FormControl style={styles.formField}>
                                    <InputLabel required id="select">Lender Name</InputLabel>
                                    <Select
                                        required
                                        onChange={event => handleInputChange(event.target.value, 'customerId')}
                                        value={loanInfo.customerId}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {customer !== undefined &&
                                            customer.map((item) => {
                                                return (
                                                    <MenuItem key={item._id} value={item._id}>{item.name} ({item.phone})</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                {displayValidationErrors('customerId')}

                                {!isLoading ? (
                                    <Button type="submit" style={styles.formField} disabled={isFormValid() ? false : true} variant="contained" color="primary">
                                        Update Loan
                                    </Button>
                                ) : (
                                        <Button style={styles.formField} variant="contained" color="primary">
                                            <CircularProgress size={20} color="secondary" />
                                        </Button>
                                    )
                                }
                            </form>
                        </Containers>
                        <Card >
                            <CardContent style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                <div>
                                    <Typography color="textSecondary">
                                        Loan EMI
                        </Typography>
                                    <Typography variant="h5" component="h2">
                                        {'\u20B9'}{emi}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography color="textSecondary">
                                        Total Interest Payable
                        </Typography>
                                    <Typography variant="h5" component="h2">
                                        {'\u20B9'}{totalIntrest}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography color="textSecondary">
                                        Total Payment
                        </Typography>
                                    <Typography variant="h5" component="h2">
                                        {'\u20B9'}{totalAmount}
                                    </Typography>
                                </div>

                            </CardContent>
                        </Card>
                    </>
                )
            }
        </>
    );
}

export default EditLoan;
