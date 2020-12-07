import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './Screens/Login/Login';
import { useEffect, useState } from 'react';
import * as Authaction from './server/Server';
import { Role } from './constant/Constant';
import LoanList from './Screens/loanList/LoanList';
import RegisterAgent from './Screens/registerAgent/RegisterAgent';
import RegisterCustomer from './Screens/registerCustomer/RegisterCustomer';
import CreateLoanRequest from './Screens/createLoanRequest/CreateLoanRequest';
import CustomerList from './Screens/customerList/CustomerList';
import EditCustomer from './Screens/editCustomer/EditCustomer';
import EditLoan from './Screens/editLoan/EditLoan';
import AllLoanList from './Screens/allLoanList/AllLoanList';
import CustomerLoanList from './Screens/customerLoanList/CustomerLoanList';

const App = () => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [data, setData] = useState({ token: token, role: role });

  useEffect(() => {
    const data = Authaction.authCheckState();
    setData(data)
  }, [])

  let routes = (
    <>
      <Route path="/login" component={() => <Login />} />
      <Redirect to="/login" />
    </>
  );

  if (data.token && data.role === Role.CUSTOMER) {
    routes = (
      <>
        <Header role={data.role} />
        <Route path="/loanList">
          <CustomerLoanList />
        </Route>
        <Route exact path="/" render={() => (<Redirect to="/loanList" />)} />
      </>
    );
  }

  if (data.token && data.role === Role.ADMIN) {
    routes = (
      <>
        <Header role={data.role} />
        <Route path="/loanList">
          <AllLoanList />
        </Route>
        <Route path="/registerAgent">
          <RegisterAgent />
        </Route>
        <Route path="/customerList">
          <CustomerList />
        </Route>
        <Route path="/editCustomer/:id">
          <EditCustomer />
        </Route>
        <Route exact path="/" render={() => (<Redirect to="/loanList" />)} />
      </>
    );
  }

  if (data.token && data.role === Role.AGENT) {
    routes = (
      <>
        <Header role={data.role} />
        <Route path="/loanList">
          <LoanList />
        </Route>
        <Route path="/registerCustomer">
          <RegisterCustomer />
        </Route>
        <Route path="/createLoanRequest">
          <CreateLoanRequest />
        </Route>
        <Route path="/editLoan/:id">
          <EditLoan />
        </Route>
        <Route path="/customerList">
          <CustomerList />
        </Route>
        <Route path="/editCustomer/:id">
          <EditCustomer />
        </Route>
        <Route exact path="/" render={() => (<Redirect to="/loanList" />)} />
      </>
    );
  }

  return (
    <Router>
      {routes}
    </Router>
  );
}

export default App;
