if (process.env.NODE_ENB === 'production') {
  module.exports = require('./prod')
} else {
  module.exports = require('./dev')
}