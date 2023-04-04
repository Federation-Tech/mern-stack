const jwt = require("jsonwebtoken");
const db = require("../../models/user-model");
const mailer = require("../../mailer/mailer");

async function verfication(req, res) {
  console.log("verification request received");
  var token = req.params.token;
  var vemail = await jwt.verify(token, process.env.verification_token_key);
  await db.findOneAndUpdate({ email: vemail }, { isvalid: true });
  res.send(
    "<h1 style='test-align:center'>You Are Verified Please visit <a href ='https://www.google.com'>Login Page</a> to login to your account</h1>"
  );
}

async function sendverficationmail(email, name) {
  var mail = {
    to: email,
    subject: "Verify Your Mail Please",
    text:
      process.env.server_address +
      "/auth/verification/" +
      jwt.sign(email, process.env.verification_token_key),
  };
  console.log(await mailer.sendMail(mail));
}

exports.verify = verfication;
exports.mail = sendverficationmail;