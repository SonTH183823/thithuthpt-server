const repo = (container) => {
  const pingRepo = require('./pingRepo')(container)
  const sessionRepo = require('./sessionRepo')(container)
  const userRepo = require('./userRepo')(container)
  const blockRepo = require('./blockRepo')(container)
  return { pingRepo, sessionRepo, userRepo, blockRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
