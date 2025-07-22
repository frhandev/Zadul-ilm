const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // جلب التوكن من الهيدر
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "يجب تسجيل الدخول للوصول." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "رمز التوكن غير صالح أو منتهي." });
  }
};

module.exports = auth;
