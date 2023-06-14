const repo = (container) => {
  const sessionRepo = require('./user/sessionRepo')(container)
  const userRepo = require('./user/userRepo')(container)
  const newsRepo = require('./news/newsRepo')(container)
  const categoryRepo = require('./news/categoryRepo')(container)
  const tagRepo = require('./news/tagRepo')(container)
  const blockRepo = require('./user/blockRepo')(container)
  const pingRepo = require('./user/pingRepo')(container)
  const userCMSRepo = require('./userCMS/userCMSRepo')(container)
  const sessionCMSRepo = require('./userCMS/sessionCMSRepo')(container)
  const rateRepo = require('./rate/rateRepo')(container)
  const examRepo = require('./exam/examRepo')(container)
  const questionRepo = require('./question/questionRepo')(container)
  const partSubjectRepo = require('./partSubject/partSubjectRepo')(container)
  return {
    sessionRepo,
    userRepo,
    newsRepo,
    tagRepo,
    categoryRepo,
    pingRepo,
    blockRepo,
    userCMSRepo,
    sessionCMSRepo,
    rateRepo,
    examRepo,
    questionRepo,
    partSubjectRepo
  }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
