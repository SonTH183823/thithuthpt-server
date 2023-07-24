require('dotenv').config()
const slugify = require('slugify')
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
const typePostConfig = {
  EXAM: 1,
  QUESTION: 2,
  DOCUMENT: 3,
  NEWS: 4
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

const subjectConfig = {
  TOAN: 1,
  LY: 2,
  HOA: 3,
  SINH: 4,
  ANH: 5,
  SU: 6,
  DIA: 7,
  GDCD: 8,
  TOEIC: 9
}

const dbSettings = {
  db: process.env.DB || 'thi-thu-thpt',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['192.168.221.27:27017']
  // servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['127.0.0.1:27017']
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

  function strToSlug (str) {
    return slugify(str, '-')
  }

  function caculatorPointExam (numLisRight, numLis, numReadRight, numRead) {
    if (numLis === numRead && numLis === 100) {
      let pL = 5
      let pR = 5
      if (numLisRight > 0 && numLisRight < 76) {
        pL = numLisRight * 5 + 10
      } else if (numLisRight > 75 && numLisRight < 96) {
        pL = numLisRight * 5 + 15
      } else {
        pL = 495
      }
      if (numReadRight > 2) pR = (numReadRight - 1) * 5
      return pR + pL
    } else {
      return Math.floor((numLisRight / numLis + numReadRight / numRead) * 495)
    }
  }

  function caculatorResultExam (listAnswer, listQuestion, listTypeQuestion) {
    let numRight = 0
    const rsTypeQuestion = []
    for (const item of listTypeQuestion) {
      const tmp = {
        id: item.id,
        label: item.label,
        value: 0,
        total: item.value
      }
      rsTypeQuestion.push(tmp)
    }

    const checkListTypeQuestion = (question) => {
      for (const idx in rsTypeQuestion) {
        if (question.category === rsTypeQuestion[idx].id) {
          rsTypeQuestion[idx].value = rsTypeQuestion[idx].value + 1
          break
        }
      }
    }
    for (const index in listQuestion) {
      if (listAnswer[index] === listQuestion[index].answer) {
        checkListTypeQuestion(listQuestion[index])
        numRight = numRight + 1
      }
    }
    return { numRight, rsTypeQuestion }
  }

  function caculatorResultToeic (listAnswer, listQuestion) {
    let numRight = 0
    for (const index in listQuestion) {
      if (listAnswer[index] === listQuestion[index]?.answer) {
        numRight = numRight + 1
      }
    }
    return numRight
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

  function addThumbnailSubject (subject) {
    switch (subject) {
      case 1:
        return 'toan.jpg'
      case 2:
        return 'ly.jpg'
      case 3:
        return 'hoa.jpg'
      case 4:
        return 'sinh.jpg'
      case 5:
        return 'anh.jpg'
      case 6:
        return 'su.jpg'
      case 7:
        return 'dia.jpg'
      case 8:
        return 'gdcd.jpg'
      default:
        return 'toeic.jpg'
    }
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

  const genDataNotification = (typePost, user, title, postId, userComment) => {
    const name = userComment.name || userComment.phoneNumber
    const messages = {
      notification: {
        title: `${name} đã bình luận trong một `,
        body: 'Bạn có thông báo mới.'
      },
      token: user.fcmToken
    }
    let notiData = {
      isRead: 0,
      isViewed: 0,
      type: 1
    }
    switch (typePost) {
      case typePostConfig.EXAM : {
        notiData = {
          ...notiData,
          content: `<div> <strong>${name}</strong> đã bình luận trong đề thi <strong>${title}</strong></div>`,
          directLink: `/exam/${strToSlug(title)}-${postId}`
        }
        messages.notification.title += 'đề thi bạn theo dõi.'
        break
      }
      case typePostConfig.DOCUMENT : {
        notiData = {
          ...notiData,
          content: `<div> <strong>${name}</strong> đã bình luận trong tài liệu <strong>${title}</strong></div>`,
          directLink: `/documents/${strToSlug(title)}-${postId}`
        }
        messages.notification.title += 'tài liệu bạn theo dõi.'
        break
      }
      case typePostConfig.NEWS : {
        notiData = {
          ...notiData,
          content: `<div> <strong>${name}</strong> đã bình luận trong tin tức <strong>${title}</strong></div>`,
          directLink: `/news/${strToSlug(title)}-${postId}`
        }
        messages.notification.title += 'tin tức bạn theo dõi.'
        break
      }
      case typePostConfig.QUESTION : {
        notiData = {
          ...notiData,
          content: `<div> <strong>${name}</strong> đã bình luận trong câu hỏi mà bạn theo dõi</div>`,
          directLink: `/question/${postId}`
        }
        messages.notification.title += 'câu hỏi bạn theo dõi.'
        break
      }
    }
    return { notiData, messages }
  }

  const genDataAwards = (user, point, type) => {
    const messages = {
      notification: {
        title: `Bạn nhận được ${point} Points `,
        body: 'Bạn có thông báo mới.'
      },
      token: user.fcmToken
    }
    let notiData = {
      isRead: 0,
      isViewed: 0,
      userId: user._id.toString(),
      type: 2,
      directLink: '/profile/me'
    }
    switch (type) {
      //loginDaily
      case 1: {
        messages.notification.title += 'từ hoạt động hàng ngày.'
        notiData = {
          ...notiData,
          content: `<div>Bạn nhận được <strong>${point} Points</strong> từ hoạt động hàng ngày.</div>`
        }
        break
      }
      // finishExam
      case 2: {
        messages.notification.title += 'vì đã hoàn thành bài thi.'
        notiData = {
          ...notiData,
          content: `<div>Bạn nhận được <strong>${point} Points</strong> vì đã hoàn thành bài thi.</div>`
        }
        break
      }
      // commentHighVote
      case 3: {
        messages.notification.title += 'từ bình luận hữu ích.'
        notiData = {
          ...notiData,
          content: `<div>Bạn nhận được <strong>${point} Points</strong> từ bình luận hữu ích.</div>`
        }
        break
      }
    }
    return { notiData, messages }
  }
  const genDataReact = (userComment, userReact, status, title, postId, typePost) => {
    const messages = {
      notification: {
        title: `${userReact.name} đã bày tỏ cảm xúc `,
        body: 'Bạn có thông báo mới.'
      },
      token: userComment.fcmToken
    }
    let notiData = {
      isRead: 0,
      isViewed: 0,
      userId: userComment._id.toString(),
      type: 3,
      userPushId: userReact._id.toString()
    }
    switch (status) {
      // like
      case 1: {
        messages.notification.title += 'Hữu ích vào bình luận của bạn.'
        notiData = {
          ...notiData,
          content: `<div><strong>${userReact.name}</strong> đã bày tỏ cảm xúc <strong>Hữu ích </strong>vào bình luận của bạn trong một </div>`
        }
        break
      }
      // dislike
      case 2: {
        messages.notification.title += 'Không hữu ích vào bình luận của bạn.'
        notiData = {
          ...notiData,
          content: `<div><strong>${userReact.name}</strong> đã bày tỏ cảm xúc <strong>Không hữu ích </strong>vào bình luận của bạn trong một </div>`
        }
        break
      }
    }
    switch (typePost) {
      case typePostConfig.EXAM : {
        notiData = {
          ...notiData,
          directLink: `/exam/${strToSlug(title)}-${postId}`,
          content: notiData.content + 'đề thi'
        }
        break
      }
      case typePostConfig.DOCUMENT : {
        notiData = {
          ...notiData,
          directLink: `/documents/${strToSlug(title)}-${postId}`,
          content: notiData.content + 'tài liệu'
        }
        break
      }
      case typePostConfig.NEWS : {
        notiData = {
          ...notiData,
          directLink: `/news/${strToSlug(title)}-${postId}`,
          content: notiData.content + 'tin tức'
        }
        break
      }
      case typePostConfig.QUESTION : {
        notiData = {
          ...notiData,
          directLink: `/question/${postId}`,
          content: notiData.content + 'câu hỏi'
        }
        break
      }
    }
    return { notiData, messages }
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
    addThumbnailSubject,
    deepCompare,
    encryptPassword,
    genTokenCMS,
    verifyTokenCMS,
    caculatorResultExam,
    caculatorResultToeic,
    caculatorPointExam,
    genDataNotification,
    genDataAwards,
    genDataReact
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
  tokenTime,
  subjectConfig
}
