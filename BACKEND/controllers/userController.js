const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 14);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    const result = await newUser.save();
    console.log("Registered User : ", result);

    const token = jwt.sign(
      { id: result._id, username: result.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).send({
      msg: "User registered successfully",
      token,
      user: {
        id: result._id,
        username: result.username,
        email: result.email
      }
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: err, msg: "Server error" });
  }
};


module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ msg: "Invalid credentials" });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.send({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.send(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}