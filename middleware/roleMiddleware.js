const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. You do not have the correct role.' });
      }
      next();
    };
  };  
  
  module.exports = checkRole;
  