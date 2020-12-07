const validator = {
    name: {
        rules: [
            {
                test: (value) => {
                    return value.length >= 4;
                },
                message: 'Full Name Required and minimum length is 4',
            },
        ],
        errors: [],
        valid: true,
        state: '',
    },
    number: {
        rules: [
            {
                test: /^[1-9]{1}[0-9]{9}$/,
                message: 'Phone Number must contain only numeric',
            },
        ],
        errors: [],
        valid: true,
        state: ''
    },
};

export default validator;