import React from 'react'
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import { Role } from '../../constant/Constant';


const drawerWidth = 240;
const StyledBreadcrumb = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: "red",
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: 'red',
        },
    },
}))(Chip);

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'block',
        cursor: 'pointer'
    },

    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },

    hide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));


const Header = props => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('expiresIn');
        window.location.reload();
    }

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={clsx(classes.hide, open && classes.hide)}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Loan Management System
                    </Typography>

                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Breadcrumbs aria-label="breadcrumb">
                            {props.role === Role.ADMIN &&
                                <Breadcrumbs>
                                    <Link to="/loanList" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Loan List"
                                        />
                                    </Link>
                                    <Link to="/registerAgent" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Register Agent"
                                        />
                                    </Link>
                                    <Link to="/customerList" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Customer List"
                                        />
                                    </Link>
                                </Breadcrumbs>
                            }
                            {props.role === Role.AGENT &&
                                <Breadcrumbs>
                                    <Link to="/loanList" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Loan List"
                                        />
                                    </Link>
                                    <Link to="/registerCustomer" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Register Customer"
                                        />
                                    </Link>
                                    <Link to="/createLoanRequest" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Create Loan Request"
                                        />
                                    </Link>
                                    <Link to="/customerList" style={{ textDecoration: "none" }}>
                                        <StyledBreadcrumb
                                            label="Customer List"
                                        />
                                    </Link>
                                </Breadcrumbs>
                            }

                            <StyledBreadcrumb
                                label="Logout"
                                onClick={logOut}
                            />
                        </Breadcrumbs>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Loan Management System
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {props.role === Role.ADMIN &&
                        <>
                            <Link to="/loanList" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Loan List</span></ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/registerAgent" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Register Agent</span></ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/customerList" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Customer List</span></ListItemText>
                                </ListItem>
                            </Link>
                        </>
                    }
                    {props.role === Role.AGENT &&
                        <>
                            <Link to="/loanList" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Loan List</span></ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/registerCustomer" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Register Customer</span></ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/createLoanRequest" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Create Loan Request</span></ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/customerList" style={{ textDecoration: "none", color: '#000' }}>
                                <ListItem button onClick={handleDrawerClose}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText><span>Customer List</span></ListItemText>
                                </ListItem>
                            </Link>
                        </>
                    }

                    <ListItem button onClick={logOut}>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText><span>Logout</span></ListItemText>
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
        </div>
    );
}

export default Header;
