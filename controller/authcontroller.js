import Auth from "../models/auth.js";
import bcrypt from "bcrypt";
import { serverResponse } from "../services/serverresponse.js";
import { tokenGenerate } from "../services/tokenGenerate.js";
import { Op } from "sequelize";

export const register = async (req, res) => {
  try {
    let { email, name, password } = req.body;
    console.log( email, name, password)
    name = name.trim();
    email = email.trim();
    password = password.trim();
    if (!email || !name || !password)
      return serverResponseResponse(
        res,
        400,
        "Email,password,Name is required",
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return serverResponse(res, 409, "Invalid Email format");
    if (!/[A-Z]/.test(password)) return serverResponse(res, 409, "Add at least one uppercase letter");
    if (!/[a-z]/.test(password)) return serverResponse(res, 409, "Add at least one lowercase letter");
    if (!/\d/.test(password)) return serverResponse(res, 409, "Add at least one number");
    if (!/[^A-Za-z0-9]/.test(password)) return serverResponse(res, 409, "Add at least one special character");
    if (password.length < 8) return serverResponse(res, 409, "Password must be at least 8 characters");
    const isEmail = await Auth.findOne({ where: { email } });
    if (isEmail) return serverResponse(res, 409, "Email is already exist");
    const Hashedpassword = await bcrypt.hash(password, 10);
    const authDataSaved = Auth.create({
      email,
      name,
      password: Hashedpassword,
    });
    return serverResponse(res, 200, "Successfully Registered");
  } catch (err) {
    return serverResponse(res, 500, err.message);
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();
    if (!email || !password)
      return serverResponseResponse(
        res,
        400,
        "Email,password is required",
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return serverResponse(res, 409, "Invalid Email format");
    if (!/[A-Z]/.test(password))
      return serverResponse(res, 409, "Add at least one uppercase letter");
    if (!/[a-z]/.test(password))
      return serverResponse(res, 409, "Add at least one lowercase letter");
    if (!/\d/.test(password))
      return serverResponse(res, 409, "Add at least one number");
    if (!/[^A-Za-z0-9]/.test(password))
      return serverResponse(res, 409, "Add at least one special character");
    if (password.length < 8)
      return serverResponse(res, 409, "Password must be at least 8 characters");
    const isemail = await Auth.findOne({ where: { email }, raw: true });
    if (!isemail) return serverResponse(res, 404, "Invalid email");
    const isPassword = await bcrypt.compare(password, isemail.password);
    if (!isPassword) return serverResponse(res, 409, "Password is incorrect");
    const tokendata = {
      id: isemail.id,
      email: isemail.email,
    };
    const Token = tokenGenerate(tokendata);
    return serverResponse(res, 201, {
      id: isemail.id,
      email: isemail.email,
      token: Token,
    });
  } catch (err) {
    return serverResponse(res, 500, err.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const getallusers = await Auth.findAll({
      attributes: { exclude: ["password"] },
      where: {
        id: {
          [Op.ne]: req.user,
        },
      },
      raw: true,
    });
    if (!getallusers) return serverResponse(res, 200, "no users");
    return serverResponse(res, 201, getallusers);
  } catch (err) {
    return serverResponse(res, 500, err.message);
  }
};
