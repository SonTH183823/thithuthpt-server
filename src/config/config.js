require('dotenv').config()
const serverSettings = {
  port: process.env.PORT || 8003,
  basePath: process.env.BASE_PATH_WEB || '/web',
  basePathCMS: process.env.BASE_PATH_CMS || '/cms',
  signature: process.env.SECRET_SIGNATURE || '#123Ag'
}
const userConfig = {
  pingInterval: +process.env.PING_INTERVAL || 60
}
const tokenTime = process.env.EXPIRE_TOKEN || '1d'

const historyType = {
  LOGIN: 1, LOGOUT: 2, BLOCK: 3, UNBLOCK: 4, KICK: 5
}
const eventConfig = {
  USER_CHANGE: 'user-change'
}

const deviceTypes = {
  ANDROID: 1, IOS: 2, WEB: 3, SUPER_APP: 4
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
  USER: 1, GUEST: 2
}
const DEFAULT_GOOGLE_APPLICATION_CREDENTIALS = require.resolve('./thi-thu-thpt-firebase-adminsdk-x2nu6-717aaa619b.json')
const cryptoSetting = {
  enable: !!+process.env.CRYPTO_ENABLE, secretKey: process.env.CRYPTO_KEY || '8a20140f249eeb21befad80f74520243'
}
const firebaseConfig = {
  serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_GOOGLE_APPLICATION_CREDENTIALS
}

const dbSettings = {
  db: process.env.DB || 'thi-thu-thpt',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  // servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['192.168.221.27:27017']
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['127.0.0.1:27017']
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const crypto = require('crypto')
  const ms = require('ms')
  const secretKey = process.env.SECRET_KEY || '123aava'
  const secretKeyCMS = process.env.SECRET_KEY_CMS || 'sonthcms'

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

  function genTokenCMS (obj) {
    return jwt.sign(obj, secretKeyCMS, { expiresIn: tokenTime })
  }

  function verifyToken (token) {
    try {
      return jwt.verify(token, secretKey)
    } catch (e) {
      return e
    }
  }

  function verifyTokenCMS (token) {
    try {
      return jwt.verify(token, secretKeyCMS)
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

  function stringToSlug (str) {
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], 'gi'), to[i])
    }

    str = str.toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/ +/g, '-')

    return str
  }

  function canRefreshToken (expDate) {
    const now = (Date.now()) / 1000
    const maxExp = ms(process.env.MAX_EXP_REFESH_TOKEN || '30d') / 1000
    return now - expDate < maxExp
  }

  const handleDataBeforeCache = (data) => {
    return {
      data: data instanceof String ? JSON.parse(data) : data, dateCreated: Date.now() / 1000
    }
  }

  function formatRegex (str) {
    const re = /([[\\^$.|?*+()])/g
    return new RegExp(str.replace(re, '\\$1'), 'gi')
  }

  function encryptPassword (password) {
    return crypto.createHash('sha256').update(password, 'binary').digest('base64')
  }

  function stringToSlugSearch (str) {
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], 'gi'), to[i])
    }

    str = str.toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/ +/g, '-')

    return str
  }

  function deepCompare (x, y) {
    let i, l, leftChain, rightChain

    function compare2Objects (x, y) {
      let p

      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true
      }

      // Compare primitives and functions.
      // Check if both arguments link to the same object.
      // Especially useful on the step where we compare prototypes
      if (x === y) {
        return true
      }

      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') || (x instanceof Date && y instanceof Date) || (x instanceof RegExp && y instanceof RegExp) || (x instanceof String && y instanceof String) || (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString()
      }

      // At last checking prototypes as good as we can
      if (!(x instanceof Object && y instanceof Object)) {
        return false
      }
      // eslint-disable-next-line no-prototype-builtins
      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false
      }

      if (x.constructor !== y.constructor) {
        return false
      }

      if (x.prototype !== y.prototype) {
        return false
      }

      // Check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
        return false
      }
      // Quick checking of one object being a subset of another.
      // todo: cache the structure of arguments[0] for performance

      for (p in y) {
        // eslint-disable-next-line no-prototype-builtins
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false
        } else if (typeof y[p] !== typeof x[p]) {
          return false
        }
      }

      for (p in x) {
        // eslint-disable-next-line no-prototype-builtins
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false
        } else if (typeof y[p] !== typeof x[p]) {
          return false
        }

        switch (typeof (x[p])) {
          case 'object':
          case 'function':

            leftChain.push(x)
            rightChain.push(y)

            if (!compare2Objects(x[p], y[p])) {
              return false
            }

            leftChain.pop()
            rightChain.pop()
            break

          default:
            if (x[p] !== y[p]) {
              return false
            }
            break
        }
      }

      return true
    }

    if (arguments.length < 1) {
      return true // Die silently? Don't know how to handle such case, please help...
      // throw "Need two or more arguments to compare";
    }
    for (i = 1, l = arguments.length; i < l; i++) {
      leftChain = [] // Todo: this can be cached
      rightChain = []
      if (!compare2Objects(arguments[0], arguments[i])) {
        return false
      }
    }

    return true
  }

  return {
    generateHash,
    decodeToken,
    canRefreshToken,
    formatRegex,
    verifyToken,
    genToken,
    getAvatar,
    stringToSnakeCase,
    handleDataBeforeCache,
    stringToSlug,
    stringToSlugSearch,
    deepCompare,
    encryptPassword,
    getRandomInt,
    genTokenCMS,
    verifyTokenCMS
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
  cryptoSetting,
  firebaseConfig,
  tokenTime
}
