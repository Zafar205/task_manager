const { authenticateToken, requireAdmin } = require('../utils/jwt');

// Export the JWT middleware functions for use in routes
module.exports = {
  authenticateToken,
  requireAdmin
};
