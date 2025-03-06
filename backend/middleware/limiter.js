
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: {
    errors: [{
      message: "",
      extensions: {
        code: "RATE_LIMIT_EXCEEDED"
      }
    }]
  }
});
module.exports=limiter