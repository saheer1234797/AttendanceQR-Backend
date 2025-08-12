const checkAdmin = (request, response, next) => {
  if (request.user && request.user.role === "admin") {
    return next();
  }
  return response.status(403).json({ message: "Access denied. Admin only." });
};

export default { checkAdmin };
