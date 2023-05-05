const registrationSchema = require("../../models/user-model");
const gravatar = require("gravatar");
const verification = require("./verification");
const User = require("../../models/user-model");

//
const postData = async (req, res) => {
  console.log(`Registration request received for ${req.body.email}`);
  req.body.isvalid = false;
  req.body.access = 0;
  req.body.img = gravatar.url(
    req.body.email,
    { s: "100", r: "x", d: "retro" },
    true
  );
  const { email, password, name, access, extradata, isvalid, img } = req.body;
  const user = await User.findOne({ email: email });
  if ((req.body.extradata = "" || !req.body.extradata)) {
    req.body.extradata = {};
  }

  if (user) {
    return res.status(400).json({ code: 1, message: "User already exists" });
  }
  if (email.includes("@")) {
    // change karo
    try {
      const data = new registrationSchema({
        // save use karo
        email,
        password,
        name,
        access,
        extradata,
        isvalid,
        img,
      });
      await data.save();
      verification.mail(email, name);
      console.log("registration done");

      return res.status(200).json({ status: "ok" });
    } catch (err) {
      console.log("registration err " + err);
      return res.status(400).json({ code: 2, error: err.message });
    }
  } else {
    console.log("invalid data entered sending err...");
    res.status(400).json({ code: 2, error: "invalid details entered" });
  }
};

exports.register = postData;
