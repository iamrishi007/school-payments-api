module.exports = (req, res, next) => {
  const { role, school_id } = req.user;
  const requestedSchoolId = req.params.schoolId;

  if (role === "admin") return next()
  if (role === "user" && school_id.toString() === requestedSchoolId.toString()) return next(); // Compare as string

  return res.status(403).json({ message: "Forbidden: cannot view other schools' transactions" });
};
