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

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditCustomer = props => {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState({ name: '', number: '' });
    const [error, setError] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchCustomerById = useCallback(async () => {
        setError(null);
        setIsLoading1(true)

        let action = authActions.getCustomerById(
            id
        );

        setError(null);

        try {
            const data = await action();
            if (data.success) {
                if (data.success) {
                    setUserInfo({ name: data.result[0].name, number: data.result[0].phone })
                }
            }

            setIsLoading1(false)
        } catch (error) {
            setError(error.message)
            setIsLoading1(false)
        }
    }, [id])

    useEffect(() => {
        fetchCustomerById().then(() => {
            setIsLoading1(false);
        })
    }, [fetchCustomerById])

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

        let action = authActions.editCustomer(
            id,
            userInfo.name,
            userInfo.number
        );

        setError(null);

        try {
            const data = await action();

            if (data.success) {
                setIsUpdated(true);
                setOpen(true);
            }

            setIsLoading(false);
        } catch (error) {
            setError(error.message)
            setIsLoading(false);
            setOpen(true);
        }
    }
    const handleInputChange = (value, inputPropName) => {
        const newState = Object.assign({}, userInfo);
        newState[inputPropName] = value;
        setUserInfo(newState);
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
                                Customer Updated Successfully
                            </Alert>
                        </Snackbar>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} >
                            <Typography style={styles.title} variant="h5" component="h2">
                                Edit Customer
                            </Typography>
                            <TextField style={styles.formField} label="Full Name" id="name"
                                type="text"
                                value={userInfo.name}
                                onChange={event => handleInputChange(event.target.value, 'name')} />
                            {displayValidationErrors('name')}
                            <TextField style={styles.formField} label="Phone Number"
                                id="number"
                                type="text"
                                value={userInfo.number}
                                onChange={event => handleInputChange(event.target.value, 'number')}
                            />
                            {displayValidationErrors('number')}


                            {!isLoading ? (
                                <Button type="submit" style={styles.formField} disabled={isFormValid() ? false : true} variant="contained" color="primary">
                                    Update Customer
                                </Button>
                            ) : (
                                    <Button style={styles.formField} variant="contained" color="primary">
                                        <CircularProgress size={20} color="secondary" />
                                    </Button>
                                )
                            }
                        </form>
                    </Containers>
                )
            }
        </>
    );
}

export default EditCustomer;
