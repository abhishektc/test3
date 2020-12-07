const router = require("express").Router();
const { checkTokenAGENTandADMIN } = require("../tokenValidation/TokenValidation");

const {
  userRegister,
  userLogin,
  editCustomer,
} = require("../utilFunctions/UserAuth");

router.post("/register", async (req, res) => {
  await userRegister(req.body, req.body.role, res);
});

router.post("/login", async (req, res) => {
  await userLogin(req.body, res);
});

router.put("/editCustomer/:id", checkTokenAGENTandADMIN, async (req, res) => {
  await editCustomer(req, res);
});

module.exports = router;
