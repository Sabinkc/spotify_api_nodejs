const mongoose = require("mongoose");
const userModel = require("../models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  const { username, email, password, role = "user" } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (isUserExist) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await userModel.create({
      username: username,
      email: email,
      password: hash,
      role: role,
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.json({ message: "Unable to create user" });
  }
}

async function login(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentails" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });

  // try {
  //   const hash = await bcrypt.hash(password, 10);

  //   const user = await userModel.findOne({
  //     $or: [{ username: username }, { email: email }],
  //     password: hash,
  //   });

  //   await res.cookie("token", token);
  //   res.status(200).json({
  //     message: "Login successfully",
  //     user: {
  //       id: user._id,
  //       email: user.email,
  //       role: user.role,
  //     },
  //   });
  // } catch (err) {
  //   res.json({ message: "Unable to login" });
  // }
}

async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = { register, login, logout };
