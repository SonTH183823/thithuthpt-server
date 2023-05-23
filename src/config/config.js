require('dotenv').config()
const serverSettings = {
  port: process.env.PORT || 8003,
  basePath: process.env.BASE_PATH || '',
  signature: process.env.SECRET_SIGNATURE || '#123Ag'
}
const userConfig = {
  pingInterval: +process.env.PING_INTERVAL || 60
}
const tokenTime = process.env.EXPIRE_TOKEN || '1d'

const OAuthConfig = {
  oauth: process.env.OAUTH_URL || 'http://127.0.0.1:4010'
}
const historyType = {
  LOGIN: 1,
  LOGOUT: 2,
  BLOCK: 3,
  UNBLOCK: 4,
  KICK: 5
}
const eventConfig = {
  USER_CHANGE: 'user-change'
}

const deviceTypes = {
  ANDROID: 1,
  IOS: 2,
  WEB: 3,
  SUPER_APP: 4
}
const httpCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  TOKEN_EXPIRED: 409,
  UNKNOWN_ERROR: 520,
  FORBIDDEN: 403,
  ADMIN_REQUIRE: 406,
  SIGNATURE_ERROR: 411,
  UNAUTHORIZED: 401,
  USER_BLOCK: 412,
  DEVICE_BLOCK: 413
}
const loginType = {
  USER: 1,
  GUEST: 2
}
const DEFAULT_GOOGLE_APPLICATION_CREDENTIALS = require.resolve('./thi-thu-thpt-firebase-adminsdk-x2nu6-717aaa619b.json')
const cryptoSetting = {
  enable: !!+process.env.CRYPTO_ENABLE,
  secretKey: process.env.CRYPTO_KEY || '8a20140f249eeb21befad80f74520243'
}
const firebaseConfig = {
  serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_GOOGLE_APPLICATION_CREDENTIALS
}

const dbSettings = {
  db: process.env.DB || 'thi-thu-thpt',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['192.168.221.27:27017']
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const crypto = require('crypto')
  const request = require('request-promise')
  const ms = require('ms')
  const secretKey = process.env.SECRET_KEY || '123aava'

  function decodeToken (token) {
    return jwt.decode(token)
  }

  function getAvatar (url, provider) {
    switch (provider) {
      case 'facebook.com':
        return `${url}?width=100&height=100`
      case 'twitter.com':
        return `${url.replace('_normal', '')}`
    }
    return url
  }

  function genToken (obj) {
    return jwt.sign(obj, secretKey, { expiresIn: tokenTime })
  }

  function verifyToken (token) {
    try {
      return jwt.verify(token, secretKey)
    } catch (e) {
      return e
    }
  }

  function getRandomInt (lower, upper) {
    return Math.floor(lower + (Math.random() * (upper - lower + 1)))
  }

  function generateHash (str) {
    return crypto.createHash('md5').update(str).digest('hex')
  }

  function stringToSnakeCase (str) {
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], 'gi'), to[i])
    }

    str = str.toLowerCase().trim()
      .replace(/[^a-z0-9 \_]/g, '')
      .replace(/ +/g, '_')

    return str
  }

  function canRefreshToken (expDate) {
    const now = (Date.now()) / 1000
    const maxExp = ms(process.env.MAX_EXP_REFESH_TOKEN || '30d') / 1000
    return now - expDate < maxExp
  }

  const handleDataBeforeCache = (data) => {
    return {
      data: data instanceof String ? JSON.parse(data) : data,
      dateCreated: Date.now() / 1000
    }
  }

  const shipLog = obj => {
    const uri = process.env.SHIPLOG_SERVICE_URL || 'http://vtvfun-shiplog-develop/shiplog/log'
    const options = {
      method: 'POST',
      uri,
      json: true,
      body: obj
    }
    return request(options)
  }
  const isCarplaToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (!err || err.name === 'TokenExpiredError') {
          return resolve(true)
        }
        resolve(false)
      })
    })
  }
  return {
    isCarplaToken,
    generateHash,
    decodeToken,
    canRefreshToken,
    verifyToken,
    genToken,
    getAvatar,
    stringToSnakeCase,
    shipLog,
    handleDataBeforeCache
  }
}
module.exports = {
  dbSettings,
  serverHelper: serverHelper(),
  serverSettings,
  httpCode,
  loginType,
  historyType,
  userConfig,
  eventConfig,
  deviceTypes,
  OAuthConfig,
  cryptoSetting,
  firebaseConfig,
  tokenTime
}
