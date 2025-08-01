// export const protect = (roles = []) => {
//   return async (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//       const user = await User.findById(decoded.id);
//       if (!user || !roles.includes(user.role)) {
//         return res.status(403).json({ message: "Forbidden" });
//       }

//       next();
//     } catch (err) {
//       res.status(401).json({ message: "Invalid token" });
//     }
//   };
// };



import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = (roles = []) => {
  return async (req, res, next) => {
    const token = req.cookies.token; // ⬅️ from cookie

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || (roles.length > 0 && !roles.includes(user.role))) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
