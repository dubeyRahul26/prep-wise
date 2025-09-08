import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.cookies['jwt-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
