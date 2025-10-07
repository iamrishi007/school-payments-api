module.exports = function authorizeSchoolTransactions(req, res, next) {
  const { role, school_id } = req.user;       // set by your auth middleware
  const requestedId = req.params.schoolId;    // from /transactions/school/:schoolId

  if (role === "admin") {
    // Admins can always view any school's data
    return next();
  }

  if (role === "school") {
    // School users can only view their own school's transactions
    if (school_id === requestedId) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: cannot view other schools' transactions" });
  }

  return res.status(403).json({ message: "Forbidden: insufficient role" });
};
