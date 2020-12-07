export const register = (username, name, number, password, role) => {
    return async data => {
        const response = await fetch('http://localhost:5000/api/user/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    name: name,
                    phone: number,
                    password: password,
                    role: role
                })
            }
        );

        if (!response.ok) {

            const errorResData = await response.json();
            const errorId = errorResData.error;
            let message = 'Something went wrong! Please try again';
            if (errorId === 'USERNAME_EXIST') {
                message = 'Username already exist!';
            }
            throw new Error(message);

        }

        const resData = await response.json();

        return resData;
    };

};

export const signin = (username, password) => {
    return async data => {
        const response = await fetch('http://localhost:5000/api/user/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            }
        );

        if (!response.ok) {

            const errorResData = await response.json();
            const errorId = errorResData.error;
            let message = 'Something went wrong!  Please try again';
            if (errorId === 'INVALID_PASSWORD') {
                message = 'Wrong password!';
            } else if (errorId === 'USERNAME_NOT_FOUND') {
                message = 'Username is not found!';
            }
            throw new Error(message);

        }

        const resData = await response.json();

        return resData;
    };

};

export const getCustomers = () => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch('http://localhost:5000/api/app/getCustomer',
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong! Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const loanRequest = (amount, intrest, month, customerId, agentId, totalIntrest, emi) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch('http://localhost:5000/api/app/loanRequest',
            {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    intrest: intrest,
                    month: month,
                    customerId: customerId,
                    agentId: agentId,
                    totalIntrest: totalIntrest,
                    emi: emi
                })
            }
        );

        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();

        return resData;
    };

};

export const editCustomer = (customerId, name, phone) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/user/editCustomer/${customerId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone
                })
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const loanListById = (id) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/loanListById/${id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const getLoanById = (id) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/getLoanById/${id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const editLoanRequest = (id, amount, intrest, month, customerId, totalIntrest, emi) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/editLoanRequest/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    intrest: intrest,
                    month: month,
                    customerId: customerId,
                    totalIntrest: totalIntrest,
                    emi: emi
                })
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error;
            let message = 'Something went wrong!  Please try again';
            if (errorId === 'CAN_NOT_UPDATE') {
                message = 'Sorry, You can\'t update now!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const getCustomerById = (id) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/getCustomerById/${id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const allLoanList = () => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/allLoanList`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const loanListByCustomerId = (id) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/loanListByCustomerId/${id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();
        return resData;
    };

};

export const updateLoanState = (id, state) => {
    const token = localStorage.getItem('token');
    return async data => {
        const response = await fetch(`http://localhost:5000/api/app/updateLoanState/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    state: state
                })
            }
        );
        if (!response.ok) {
            let message = 'Something went wrong!  Please try again';
            throw new Error(message);
        }

        const resData = await response.json();

        return resData;
    };

};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
            localStorage.removeItem('expiresIn');
            return {
                token: null,
                role: null
            }
        } else {
            const expirationDate = localStorage.getItem('expiresIn');
            if (expirationDate <= new Date().getTime()) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                localStorage.removeItem('expiresIn');
                return {
                    token: null,
                    role: null
                }
            } else {
                const role = localStorage.getItem('role');
                return {
                    token: token,
                    role: role
                }
            }
        }
    };
};