import React, { useEffect, useState, useCallback } from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import FilterListIcon from '@material-ui/icons/FilterList';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

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

const LoanList = props => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loanList, setLoanList] = useState([]);
    const [filterLoanList, setFilterLoanList] = useState();
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchLoanList = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        let action = authActions.loanListById(
            localStorage.getItem('userId')
        );

        setError(null);

        try {
            const data = await action();
            setLoanList(data.result);
            setFilterLoanList(data.result);
            setIsLoading(false)
        } catch (error) {
            setError(error.message);
            setOpen(true);
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLoanList().then(() => {
            setIsLoading(false)
        });
    }, [fetchLoanList])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const filterLoanListHandler = (type, name, val = 'NEW') => {
        let result = [];
        if (type === 'filter') {
            result = loanList.filter((data) => {
                if (data[name] === val)
                    return data
                return null
            })
        } else if (type === 'sort') {
            result = loanList.sort((a, b) => b[name] - a[name]);
        } else if (type === 'sortDate') {
            result = loanList.sort((a, b) => new Date(b[name]).getTime() - new Date(a[name]).getTime());
        }
        setFilterLoanList(ele => [...result]);
        setAnchorEl(null);
    }

    return (
        <Container style={{ marginTop: '2%' }}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={50} color="primary" />
                </div>
            ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Typography style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }} variant="h6" component="h2">
                                Loan List
                            </Typography>
                            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose1}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Alert onClose={handleClose1} severity="error">
                                    {error}
                                </Alert>
                            </Snackbar>
                            <Button variant="contained" title="Filter Loan List" color="primary" onClick={handleClick}><FilterListIcon fontSize="default" /></Button>
                            <StyledMenu
                                id="customized-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <StyledMenuItem onClick={e => filterLoanListHandler('sort', 'amount')}>
                                    <ListItemText primary="Amount" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('sort', 'intrest')}>
                                    <ListItemText primary="Intrest Rate" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('sort', 'month')}>
                                    <ListItemText primary="Month" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('sortDate', 'createdAt')}>
                                    <ListItemText primary="Loan Created" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('sortDate', 'updatedAt')}>
                                    <ListItemText primary="Loan UpdatedAt" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('filter', 'state', 'NEW')}>
                                    <ListItemText primary="State- NEW" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('filter', 'state', 'APPROVED')}>
                                    <ListItemText primary="State- APPROVED" />
                                </StyledMenuItem>
                                <StyledMenuItem onClick={e => filterLoanListHandler('filter', 'state', 'REJECTED')}>
                                    <ListItemText primary="State- REJECTED" />
                                </StyledMenuItem>
                            </StyledMenu>
                        </div>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>SI. NO</StyledTableCell>
                                        <StyledTableCell>Lender Name</StyledTableCell>
                                        <StyledTableCell>Phone</StyledTableCell>
                                        <StyledTableCell>Amount</StyledTableCell>
                                        <StyledTableCell>Intrest Rate</StyledTableCell>
                                        <StyledTableCell>Month</StyledTableCell>
                                        <StyledTableCell>Total Intrest</StyledTableCell>
                                        <StyledTableCell>EMI</StyledTableCell>
                                        <StyledTableCell>State</StyledTableCell>
                                        <StyledTableCell>Action</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterLoanList !== undefined &&
                                        filterLoanList.map((row, index) => (
                                            <StyledTableRow key={row._id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.customerId.name}
                                                </StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.customerId.phone}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.amount}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.intrest}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.month}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.totalIntrest}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.emi}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.state}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    <Button disabled={row.state === 'NEW' ? false : true} variant="contained" color="secondary">
                                                        <Link style={{ textDecoration: 'none', color: 'white' }}
                                                            to={`editLoan/${row._id}`}
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

export default LoanList;
