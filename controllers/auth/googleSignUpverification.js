const jwt = require("jsonwebtoken");
const userSchema = require("../../models/user-model");
const { validationResult } = require("express-validator");

async function googleSignUpVerification(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  console.log(`FED-TECH -> Google Login Request by ${email}`);

  try {
    const user = await userSchema.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          username: email,
          access: user.access,
        },
        process.env.access_token_key,
        { expiresIn: "86400s" }
      );

      console.log(`FED-TECH -> ${email} Login Success 🥳`);

      user.isvalid = undefined;
      user["password"] = undefined;
      user["__v"] = undefined;

      res.status(202).json({ status: true, token, user });
    } else {
      console.log(
        `FED-TECH -> User does not exists [Google Login] Request by ${email}`
      );
      return res.json({ status: false, message: "User does not exists" });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.googleSignUpVerification = googleSignUpVerification;
