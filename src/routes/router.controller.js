require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Client = require("../models/client");
const Supplier = require("../models/supplier");

const singUp = async (req, res) => {
    //req.body.descripcion = null;
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
  };

const crearClient= async (req, res) => {
    //req.body.descripcion = null;
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
  };

  const createSupplier= async (req, res) => {
   // req.body.descripcion = null;
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
  };

  const singIn= async (req, res) => {
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
  };

  const updateUser= async (req, res) => {
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
  };

  const deleteUser= async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    console.log(password)
    const user = await User.findOne({ _id: id }, "password");
   if(password != undefined) {

       bcrypt.compare(password, user.password).then(async (result) => {
         if (result === true) {
           await User.findByIdAndDelete(id, function (err, docs) {
             res.json({ status: "User deleted" });
           });
         } else {
           return res.status(401).send("Contraseña incorrecta o Campo vacío");
         }
       });
   }else{
    res.json({msj: "contraseña necesaria para realizar esta acción"})
   }
  };

  const getUsers= async (req, res) => {
    const users = await User.find();
    return res.json(users).status(200);
  };

  const getClients= async (req, res) => {
    const clients = await Client.find();
    return res.json(clients).status(200);
  };

  const getSuppliers=  async (req, res) => {
    const suppliers = await Supplier.find();
    return res.json(suppliers).status(200);
  }



module.exports={
singUp,
crearClient,
createSupplier,
singIn,
updateUser,
deleteUser,
getUsers,
getClients,
getSuppliers
};