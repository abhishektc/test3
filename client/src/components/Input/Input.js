import React, { useReducer, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Inputs from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';
const INPUT_FOCUS = 'INPUT_FOCUS';


const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            };
        case INPUT_BLUR:
            return {
                ...state,
            };
        case INPUT_FOCUS:
            return {
                ...state,
                touched: true,
            };
        default:
            return state;
    }
};

const Input = props => {
    const [showPassword, setPassword] = useState(false);

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid,
        touched: false,
        isFocused: false
    });

    const { onChange, id } = props;

    useEffect(() => {
        if (inputState.touched) {
            onChange(id, inputState.value, inputState.isValid);
        }
    }, [inputState, onChange, id]);

    const textChangeHandler = (text) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        const usernameRegex = /^[a-z0-9_]+$/;
        const phoneRegex = /^[1-9]{1}[0-9]{9}$/;
        const intrestRegex = /^\d{1,2}(\.\d{1,2})?$/;
        const monthRegex = /^[1-9]\d*$/;
        const amountRegex = /^[1-9]\d{3,}$/;

        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.id === 'username' && !usernameRegex.test(text)) {
            isValid = false;
        }
        if (props.id === 'password' && !passwordRegex.test(text)) {
            isValid = false;
        }
        if (props.id === 'number' && !phoneRegex.test(text)) {
            isValid = false;
        }
        if (props.id === 'intrest' && !intrestRegex.test(text)) {
            isValid = false;
        }
        if (props.id === 'month' && !monthRegex.test(text)) {
            isValid = false;
        }
        if (props.id === 'amount' && !amountRegex.test(text)) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        if (props.maxLength != null && text.length > props.maxLength) {
            isValid = false;
        }
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
    };


    const lostFocusHandler = (event) => {
        dispatch({ type: INPUT_FOCUS });
    };

    const handleClickShowPassword = () => {
        setPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            {props.id !== 'password' && props.id !== 'customerId' ? (
                <TextField
                    {...props}
                    value={inputState.value}
                    onChange={event => textChangeHandler(event.target.value)}
                    onFocus={lostFocusHandler}
                />
            ) : (
                    <FormControl style={{ marginLeft: '2%', marginTop: '2%', marginRight: '2%', width: '100%' }}>
                        {props.id === 'password' ? (
                            <>
                                <InputLabel required htmlFor="password">Password</InputLabel>
                                <Inputs
                                    {...props}
                                    value={inputState.value}
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={event => textChangeHandler(event.target.value)}
                                    onFocus={lostFocusHandler}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </>
                        ) : (
                                <>
                                    <InputLabel required id="select">{props.label}</InputLabel>
                                    <Select
                                        {...props}
                                        onChange={event => textChangeHandler(event.target.value)}
                                        onFocus={lostFocusHandler}
                                        value={inputState.value}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {props.data !== undefined &&
                                            props.data.map((item) => {
                                                return(
                                                <MenuItem key={item._id} value={item._id}>{item.name} ({item.phone})</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </>
                            )}

                    </FormControl>
                )}

            {!inputState.isValid && inputState.touched && (
                <div>
                    <FormHelperText style={{ marginLeft: '2%', color: 'red' }}>{props.validation}</FormHelperText>
                </div>
            )}
        </div>
    );
};

export default Input;
