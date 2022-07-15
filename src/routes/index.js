const { Router } = require("express");
const { singUp, crearClient, createSupplier, singIn, updateUser, deleteUser, getUsers, getClients, getSuppliers } = require("./router.controller");
const router = Router();

router.post("/signup", singUp);

router.post("/create/client", crearClient);

router.post("/create/supplier", createSupplier);

router.post("/signin", singIn);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

router.get("/users", getUsers);

router.get("/clients", getClients);

router.get("/suppliers", getSuppliers);
module.exports = router;
