const { Schema, model } = require("mongoose");
const supplierSchema = new Schema(
  {
    nombre: { type: String, required: true },
    empresa: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = model("proveedores", supplierSchema);
