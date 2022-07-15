const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");

const saltRounds = 10;

const userSchema = new Schema(
  {
    name1: { type: String, required: true },
    name2: { type: String, required: false },
    appe1: { type: String, required: true },
    appe2: { type: String, required: false },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    telefono: { type: String, required: false },
    fecha_naci: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;

    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

module.exports = model("user", userSchema);
