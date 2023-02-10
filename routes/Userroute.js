const express = require("express");
const UserModal = require("../db/models/Usermodal");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { Op, where } = require("sequelize");

router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;

  const checkUser = await UserModal.findOne({
    where: { email },
  });

  if (checkUser) {
    return res.status(400).send({ msg: "Email Already Exists" });
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const newUser = await UserModal.create({
    name,
    email,
    password,
  });

  return res
    .status(201)
    .json({ msg: "User Created Successfully", data: newUser });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await UserModal.findOne({
    where: {
      email,
      password: { [Op.ne]: null },
    },
  });

  if (!user) {
    return res.status(404).json("User Not Found");
  } else {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).send("Invalid Email or Password!");
    } else {
      return res.json(user);
    }
  }
});

router.get("/getAllUsers/:id", async (req, res) => {
  try {
    const users = await UserModal.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

router.post("/setAvatar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const avatarImage = req.body.avatarImage;
    const isAvatarImageSet = req.body.isAvatarImageSet;

    const userData = await UserModal.findOne({
      where: {
        id: id,
      },
    });
    const editUserData = await UserModal.update(req.body, {
      where: {
        id: userData.dataValues.id,
      },
    });

    res.status(201).json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    console.log(error);
  }
});

//Search users

router.get("/search", async (req, res) => {
  const { search } = req.query;
  const getUsers = await UserModal.findAll({
    where: {
      name: { [Op.like]: `%${search}%` },
    },
  });
  if (search === "") {
    return res.status(200).json([]);
  } else {
    res.status(200).json(getUsers);
  }
});

module.exports = router;
