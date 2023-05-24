const repo = (container) => {
  const sessionRepo = require('./sessionRepo')(container)
  const userRepo = require('./userRepo')(container)
  const newsRepo = require('./newsRepo')(container)
  const categoryRepo = require('./categoryRepo')(container)
  const tagRepo = require('./tagRepo')(container)
  const blockRepo = require('./blockRepo')(container)
  const pingRepo = require('./pingRepo')(container)
  return { sessionRepo, userRepo, newsRepo, tagRepo, categoryRepo, pingRepo, blockRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
