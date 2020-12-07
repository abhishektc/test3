import React, { useEffect, useState, useCallback } from 'react'
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as authActions from '../../server/Server';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const CustomerList = props => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const classes = useStyles();
    const [customerList, setCustomerList] = useState();
    const [search, setSearch] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchCustomer = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        let action = authActions.getCustomers();

        setError(null);

        try {
            const data = await action();
            setCustomerList(data.result);
            setIsLoading(false);

        } catch (error) {
            setError(error.message)
            setIsLoading(false);
            setOpen(true);
        }
    }, [])

    useEffect(() => {
        fetchCustomer().then(() => {
            setIsLoading(false);
        });

    }, [fetchCustomer])

    const searchCustomerHandler = (event) => {
        const target = event.target;
        setSearch(target.value)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Container style={{ marginTop: '2%' }}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={50} color="primary" />
                </div>
            ) : (
                    <>
                        <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} variant="h6" component="h2">
                            Customer List
                        </Typography>
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
                        <TableContainer component={Paper}>
                            <TextField
                                style={{ margin: '2%', width: "96%" }}
                                type="search"
                                label="Search customer"
                                onChange={searchCustomerHandler}
                            />
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>SI. NO</StyledTableCell>
                                        <StyledTableCell>Name</StyledTableCell>
                                        <StyledTableCell>Phone</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customerList !== undefined &&
                                        customerList.filter((data) => {
                                            if (search == null)
                                                return data
                                            else if (data.name.toLowerCase().includes(search.toLowerCase())) {
                                                return data
                                            }
                                            return null;
                                        }).map((row, index) => (
                                            <StyledTableRow key={row._id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.phone}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    <Button variant="contained" color="secondary">
                                                        <Link style={{textDecoration: 'none', color:'white'}}
                                                            to={`editCustomer/${row._id}`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </Button>

                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

        </Container>
    );
}

export default CustomerList;
