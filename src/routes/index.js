require("dotenv").config();

const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Client = require("../models/client");
const Supplier = require("../models/supplier");

router.post("/signup", async (req, res) => {
  req.body.descripcion = null;
  const { name1, name2, appe1, appe2, email, password, telefono, fecha_naci } =
    req.body;

  const newUser = new User({
    name1,
    name2,
    appe1,
    appe2,
    email,
    password,
    telefono,
    fecha_naci,
  });

  const db_email = await User.findOne({ email });

  if (db_email) {
    return res.status(401).send("E-mail ya registrado");
  }

  if (req.body.password.length >= 8) {
    await newUser.save();

    res.status(200).json({ message: "Usuario registrado exitosamente" });
  } else {
    return res.status(401).send("Necesita 8 dígitos como mínimo");
  }
});
router.post("/create/client", async (req, res) => {
  req.body.descripcion = null;
  const { nombre, telefono } = req.body;

  const newClient = new Client({
    nombre,
    telefono,
  });

  const db_name = await Client.findOne({ nombre });

  if (db_name) {
    return res.status(401).send("Cliente ya reigstrado");
  }

  await newClient.save();

  res.status(200).json({ message: "Cliente creado satisfactoriamente" });
});
router.post("/create/supplier", async (req, res) => {
  req.body.descripcion = null;
  const { nombre, empresa } = req.body;

  const newSupplier = new Supplier({
    nombre,
    empresa,
  });

  const db_name = await Supplier.findOne({ nombre });

  if (db_name) {
    return res.status(401).send("Suppliere ya reigstrado");
  }

  await newSupplier.save();

  res.status(200).json({ message: "Supplier created successfully" });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("E-mail no registrado");
  }
  bcrypt.compare(password, user.password).then((result) => {
    if (result === true) {
      const token = jwt.sign(
        { _id: user._id },
        process.env.SECRET_KEY,
        { algorithm: "HS512" },
        { expiresIn: "1h" }
      );
      res.status(200).json({ user: user, token: token });
    } else {
      return res.status(401).send("Contraseña incorrecta");
    }
  });
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name1, name2, appe1, appe2, password, telefono, fecha_naci } =
    req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({ status: "El usuario no existe" });
  }
  bcrypt.compare(password, user.password).then(async (result) => {
    if (result === true) {
      await User.findByIdAndUpdate(
        id,
        { name1, name2, appe1, appe2, telefono, fecha_naci },
        { new: true }
      );
      res.json({ status: "User Updated" });
    } else {
      return res.status(401).send("Contraseña incorrecta o Campo vacío");
    }
  });
});

router.delete("/delete/:id", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  const user = await User.findOne({ _id: id }, "password");

  bcrypt.compare(password, user.password).then(async (result) => {
    if (result === true) {
      await User.findByIdAndDelete(id, function (err, docs) {
        res.json({ status: "User deleted" });
      });
    } else {
      return res.status(401).send("Contraseña incorrecta o Campo vacío");
    }
  });
});
router.get("/users", async (req, res) => {
  const users = await User.find();
  return res.json(users).status(200);
});
router.get("/clients", async (req, res) => {
  const clients = await Client.find();
  return res.json(clients).status(200);
});
router.get("/suppliers", async (req, res) => {
  const suppliers = await Supplier.find();
  return res.json(suppliers).status(200);
});
module.exports = router;
