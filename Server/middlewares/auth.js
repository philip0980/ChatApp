import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = (req, res, next) => {
  const token =
    req.cookies["chattu-token"] || req.headers.authorization.split(" ")[1];

  if (!token) return next(new Error("Please login to access the route"));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
};

export { isAuthenticated };
