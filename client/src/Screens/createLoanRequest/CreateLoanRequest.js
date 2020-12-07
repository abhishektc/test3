import React, { useEffect, useState, useReducer, useCallback } from 'react'
import { Containers } from '../../components/Container/Container'
import Input from '../../components/Input/Input'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as authActions from '../../server/Server';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const CreateLoanRequest = props => {
    const [error, setError] = useState(null);
    const [isLoanCreated, setLoanCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(true);
    const [open, setOpen] = useState(false);
    const [emi, setEMI] = useState();
    const [totalIntrest, setTotalIntrest] = useState();
    const [loanReport, setLoanReport] = useState([]);
    const [totalAmount, setTotalAmount] = useState();
    const [customerList, setCustomerList] = useState();

    const fetchCustomer = useCallback(async () => {
        setError(null);
        setIsLoading1(true);
        let action = authActions.getCustomers();

        setError(null);

        try {
            const data = await action();
            setCustomerList(data.result);
            setIsLoading1(false)
        } catch (error) {
            setError(error.message);
            setIsLoading1(false)
        }
    }, [])

    useEffect(() => {
        fetchCustomer().then(() => {
            setIsLoading1(false)
        });

    }, [fetchCustomer])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setLoanCreated(false);
    };

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            amount: '',
            intrest: '',
            month: '',
            customerId: ''
        },
        inputValidities: {
            amount: false,
            intrest: false,
            month: false,
            customerId: false
        },
        formIsValid: false,
    });

    function calCulateEMI() {
        if (formState.inputValidities.amount && formState.inputValidities.intrest && formState.inputValidities.month) {
            const month = formState.inputValues.month;
            const r = formState.inputValues.intrest / 12 / 100;
            const amount = JSON.parse(formState.inputValues.amount);
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

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError(null);
        setIsLoading(true);

        let action = authActions.loanRequest(
            formState.inputValues.amount,
            formState.inputValues.intrest,
            formState.inputValues.month,
            formState.inputValues.customerId,
            localStorage.getItem('userId'),
            totalIntrest,
            emi
        );

        setError(null);

        try {
            const data = await action();

            if (data.success) {
                setLoanCreated(true);
            }

            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
            setOpen(true);
        }
    }

    const styles = {
        title: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        formField: { marginLeft: '2%', marginTop: '2%', marginRight: '2%', width: '100%' }
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
                            <Snackbar open={isLoanCreated} autoHideDuration={3000} onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Alert onClose={handleClose} severity="success">
                                    Loan Requested Successfully
                                </Alert>
                            </Snackbar>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} >
                                <Typography style={styles.title} variant="h5" component="h2">
                                    Create Loan Request
                                </Typography>
                                <Input
                                    style={styles.formField}
                                    type="text"
                                    id="amount"
                                    label="Amount"
                                    onChange={inputChangeHandler}
                                    onBlur={calCulateEMI}
                                    required
                                    validation="Amount must be greater than 1000."
                                />

                                <Input
                                    style={styles.formField}
                                    type="text"
                                    id="intrest"
                                    label="Intrest Rate"
                                    onChange={inputChangeHandler}
                                    onBlur={calCulateEMI}
                                    required
                                    validation="Intrest rate is required. Eg: 5, 5.50, 9.25, etc,."
                                />

                                <Input
                                    style={styles.formField}
                                    type="text"
                                    id="month"
                                    label="Loan Tenure(in month)"
                                    onChange={inputChangeHandler}
                                    onBlur={calCulateEMI}
                                    required
                                    validation="Month contains only numeric."
                                />

                                <Input
                                    labelId="select"
                                    id="customerId"
                                    label="Lender Name"
                                    onChange={inputChangeHandler}
                                    required
                                    validation="Lender name required."
                                    data={customerList}
                                />

                                {!isLoading ? (
                                    <Button type="submit" style={{ margin: '2%', width: '100%' }} disabled={!formState.formIsValid} variant="contained" color="primary">
                                        CREATE LOAN REQUEST
                                    </Button>
                                ) : (
                                        <Button style={{ margin: '2%', width: '100%' }} variant="contained" color="primary">
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
                )}
        </>

    );
}

export default CreateLoanRequest;
