const { Schema, model } = require("mongoose");
const clientSchema = new Schema(
  {
    nombre: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = model("clientes", clientSchema);
