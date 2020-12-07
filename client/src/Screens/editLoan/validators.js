const validator = {
    amount: {
        rules: [
            {
                test: /^[1-9]\d{3,}$/,
                message: 'Amount must be greater than 1000.',
            },
        ],
        errors: [],
        valid: true,
        state: '',
    },
    intrest: {
        rules: [
            {
                test: /^\d{1,2}(\.\d{1,2})?$/,
                message: 'Intrest rate is required. Eg: 5, 5.50, 9.25, etc,.',
            },
        ],
        errors: [],
        valid: true,
        state: ''
    },
    month: {
        rules: [
            {
                test: /^[1-9]\d*$/,
                message: 'Month contains only numeric.',
            },
        ],
        errors: [],
        valid: true,
        state: ''
    },
    customerId: {
        rules: [
            {
                test: (value) => {
                    return value.length >= 1;
                },
                message: 'Lender name required.',
            },
        ],
        errors: [],
        valid: true,
        state: ''
    },
};

export default validator;