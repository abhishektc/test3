import React, { useState, useReducer, useCallback } from 'react'
import { Containers } from '../../components/Container/Container'
import Input from '../../components/Input/Input'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as authActions from '../../server/Server';
import { Role } from '../../constant/Constant';

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

const RegisterAgent = props => {
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setIsLogin(false);
    };

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            username: '',
            name: '',
            number: '',
            password: ''
        },
        inputValidities: {
            username: false,
            name: false,
            number: false,
            password: false
        },
        formIsValid: false
    });

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

        let action = authActions.register(
            formState.inputValues.username,
            formState.inputValues.name,
            formState.inputValues.number,
            formState.inputValues.password,
            Role.CUSTOMER
        );

        setError(null);

        try {
            const data = await action();

            if (data.success) {
                setIsLogin(true);
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
            <Snackbar open={isLogin} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert onClose={handleClose} severity="success">
                    Register Successfully
                </Alert>
            </Snackbar>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} >
                <Typography style={styles.title} variant="h5" component="h2">
                    Register Customer
                </Typography>
                <Input
                    style={styles.formField}
                    type="text"
                    id="username"
                    label="Username"
                    onChange={inputChangeHandler}
                    required
                    minLength={4}
                    validation="Username must contain only alphabets-numeric lowercase characters and minimum length is 4"
                />
                <Input
                    style={styles.formField}
                    type="text"
                    id="name"
                    label="Full Name"
                    onChange={inputChangeHandler}
                    required
                    minLength={4}
                    validation="Full Name Required and minimum length is 4"
                />
                <Input
                    style={styles.formField}
                    type="text"
                    id="number"
                    label="Phone Number"
                    onChange={inputChangeHandler}
                    required
                    minLength={10}
                    maxLength={10}
                    validation="Phone Number must contain only numeric"
                />
                <Input
                    id="password"
                    onChange={inputChangeHandler}
                    required
                    minLength={8}
                    maxLength={16}
                    validation="Please enter a valid password(must be 8 to 16 characters with 1 number, 1 uppercase & lowercase)."

                />
                {!isLoading ? (
                    <Button type="submit" style={{ margin: '2%', width: '100%' }} disabled={!formState.formIsValid} variant="contained" color="primary">
                        Register
                    </Button>
                ) : (
                        <Button style={{ margin: '2%', width: '100%' }} variant="contained" color="primary">
                            <CircularProgress size={20} color="secondary" />
                        </Button>
                    )
                }
            </form>
        </Containers>
    );
}

export default RegisterAgent;
