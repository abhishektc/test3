const router = require("express").Router();
const { checkToken, checkTokenAGENTandADMIN, checkTokenAGENT, checkTokenADMIN } = require("../tokenValidation/TokenValidation");
const {
  getCustomers,
  loanRequest,
  loanListById,
  allLoanList,
  getLoanById,
  editLoanRequest,
  getCustomerById,
  loanListByCustomerId,
  updateLoanState
} = require("../utilFunctions/AppFunctions");

router.get("/getCustomer", checkTokenAGENTandADMIN, async (req, res) => {
  await getCustomers(req, res);
});

router.post("/loanRequest", checkTokenAGENT, async (req, res) => {
  await loanRequest(req.body, res);
});

router.get("/loanListById/:id", checkTokenAGENT, async (req, res) => {
  await loanListById(req, res);
});

router.get("/allLoanList", checkTokenADMIN, async (req, res) => {
  await allLoanList(req, res);
});

router.get("/getLoanById/:id", checkTokenAGENT, async (req, res) => {
  await getLoanById(req, res);
});

router.put("/editLoanRequest/:id", checkTokenAGENT, async (req, res) => {
  await editLoanRequest(req, res);
});

router.get("/getCustomerById/:id", checkTokenAGENTandADMIN, async (req, res) => {
  await getCustomerById(req, res);
});

router.get("/loanListByCustomerId/:id", checkToken, async (req, res) => {
  await loanListByCustomerId(req, res);
});

router.put("/updateLoanState/:id", checkTokenADMIN, async (req, res) => {
  await updateLoanState(req, res);
});

module.exports = router;
