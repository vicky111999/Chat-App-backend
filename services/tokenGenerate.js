import jwt from "jsonwebtoken";

export const tokenGenerate = (user) => {
  return jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: "5d" });
};
