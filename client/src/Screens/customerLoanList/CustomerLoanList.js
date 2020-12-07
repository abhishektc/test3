import React, { useEffect, useState, useCallback, useRef } from 'react'
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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

const CustomerLoanList = props => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loanList, setLoanList] = useState([]);
    const [filterLoanList, setFilterLoanList] = useState();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const [emi, setEMI] = useState();
    const [totalIntrest, setTotalIntrest] = useState();
    const [loanReport, setLoanReport] = useState([]);
    const [totalAmount, setTotalAmount] = useState();

    const handleClickOpen = (scrollType) => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose1 = () => {
        setOpen(false);
    };

    const fetchLoanList = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        let action = authActions.loanListByCustomerId(
            localStorage.getItem('userId')
        );

        setError(null);

        try {
            const data = await action();
            setLoanList(data.result);
            setFilterLoanList(data.result);
            setIsLoading(false)
        } catch (error) {
            setOpen1(true);
            setError(error.message);
            setIsLoading(false)
        }
    }, [])

    const descriptionElementRef = useRef(null);
    useEffect(() => {
        fetchLoanList().then(() => {
            setIsLoading(false)
        });

        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open, fetchLoanList])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClose2 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen1(false);
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

    function calculateEmi(amounts, intrests, months, emis, totalIn) {
        const month = months;
        const r = intrests / 12 / 100;
        const amount = amounts;
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
        handleClickOpen('paper')
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
                            <Snackbar open={open1} autoHideDuration={3000} onClose={handleClose2}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Alert onClose={handleClose2} severity="error">
                                    {error}
                                </Alert>
                            </Snackbar>
                            <Button variant="contained" title="Filter Loan List" color="primary" onClick={handleClick}><FilterListIcon fontSize="default" /></Button>
                            <StyledMenu
                                id="customized-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose1}
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
                                        <StyledTableCell>Agent Name</StyledTableCell>
                                        <StyledTableCell>Phone</StyledTableCell>
                                        <StyledTableCell>Amount</StyledTableCell>
                                        <StyledTableCell>Intrest Rate</StyledTableCell>
                                        <StyledTableCell>Month</StyledTableCell>
                                        <StyledTableCell>Total Intrest</StyledTableCell>
                                        <StyledTableCell>EMI</StyledTableCell>
                                        <StyledTableCell>State</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterLoanList !== undefined &&
                                        filterLoanList.map((row, index) => (
                                            <StyledTableRow key={row._id} onClick={e => calculateEmi(row.amount, row.intrest, row.month, row.emi, row.totalIntrest)}>
                                                <StyledTableCell component="th" scope="row">
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.agentId.name}
                                                </StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.agentId.phone}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.amount}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.intrest}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.month}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.totalIntrest}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.emi}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row">{row.state}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Loan Report Total Amount Payable({totalIntrest+totalAmount})</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>EMI</th>
                                <th>Amount Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanReport !== undefined &&
                                loanReport.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.month}</td>
                                            <td>{emi}</td>
                                            <td>{item.loanBalance}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose1} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CustomerLoanList;
