const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

async function handleSignUp(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

  // Field validation
  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail && existingUsername) {
      return res
        .status(400)
        .json({ message: "Email and username already exist." });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({ message: "Invalid user credentials." });
    }

    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const payload = {
      email: dbUser.email,
      username: dbUser.username,
    };

    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      user: payload,
      jwtToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = handleLogin;

module.exports = { handleSignUp, handleLogin };
