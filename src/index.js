const { initDI } = require('./di')
const config = require('./config')
const { notification } = config
const logger = require('./logger')
const middleware = require('./middleware')
const firebaseAdmin = require('firebase-admin')
const server = require('./server')
const models = require('./models')
const listener = require('./listener')
const lang = require('./lang')
const controller = require('./controller')
const { connect } = require('./database')
const repo = require('./repo')
const EventEmitter = require('events').EventEmitter
const mediator = new EventEmitter()
mediator.once('di.ready', container => {
  console.log('di.ready, starting connect db ', config.dbSettings)
  container.registerValue('config', config)
  container.registerValue('i18n', lang('en'))
  container.registerValue('middleware', middleware)
  container.registerValue('logger', logger)
  container.registerValue('mediator', mediator)
  mediator.once('db.ready', db => {
    logger.d('db.ready, starting server')
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(config.firebaseConfig.serviceAccountPath)
    })
    container.registerValue('firebaseAdmin', firebaseAdmin)
    container.registerValue('notification', notification(container))
    container.registerValue('db', db)
    container.registerValue('models', models(container))
    const repository = repo.connect(container)
    container.registerValue('repo', repository)
    container.registerValue('controller', controller(container))
    container.registerValue('middleware', middleware(container))
    server.start(container).then(app => {
      logger.d('Server started at port ', app.address().port)
      listener(container)
    })
  })
  connect(container, mediator)
})
initDI(mediator)
