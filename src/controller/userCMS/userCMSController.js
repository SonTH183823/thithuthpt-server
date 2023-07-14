module.exports = (container) => {
  const { schemaValidator, schemas: { UserCMS } } = container.resolve('models')
  const roleConfig = UserCMS.getRoleConfig()
  const {
    httpCode,
    serverHelper
  } = container.resolve('config')
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    userCMSRepo,
    sessionCMSRepo
  } = container.resolve('repo')

  userCMSRepo.addUserCMS({
    username: 'admin',
    isAdministrator: 1,
    name: 'Tô Hoài Sơn',
    roles: [1, 2, 3, 4, 5, 6],
    password: serverHelper.encryptPassword('123456')
  }).catch(() => {})

  const MAX_LOGIN = +process.env.MAX_LOGIN || 2
  const addUserCMS = async (req, res) => {
    try {
      const userCMS = req.body
      const {
        error,
        value
      } = await schemaValidator(userCMS, 'UserCMS')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      value.password = serverHelper.encryptPassword(value.password)
      if (value.isAdministrator && !req.userCMS.isAdministrator) {
        value.isAdministrator = 0
      }
      const sp = await userCMSRepo.addUserCMS(value)
      res.status(httpCode.SUCCESS).send({
        msg: 'Thêm thành công.',
        data: sp
      })
    } catch (e) {
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tên đăng nhập đã tồn tại, vui lòng thử lại.' })
      }
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const logout = async (req, res) => {
    try {
      const token = req.headers['x-access-token'] || ''
      await sessionCMSRepo.removeSessionCMS({ hash: serverHelper.generateHash(token) })
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const login = async (req, res) => {
    try {
      const {
        username,
        password
      } = req.body
      if (username && password) {
        const userCMS = await userCMSRepo.login({
          username,
          password: serverHelper.encryptPassword(password)
        })
        if (userCMS) {
          const u = userCMS.toObject()
          const token = serverHelper.genTokenCMS(u)
          const { exp } = serverHelper.decodeToken(token)
          await sessionCMSRepo.addSessionCMS(serverHelper.generateHash(token), u._id, exp)
          const allSess = await sessionCMSRepo.getSessionCMS({ userCMSId: String(u._id) })
          while (allSess.length > MAX_LOGIN) {
            await sessionCMSRepo.removeSessionCMSById(String((allSess.pop())._id))
          }
          return res.status(httpCode.SUCCESS).json({
            ...u,
            token
          })
        }
        res.status(httpCode.BAD_REQUEST).json({ msg: 'Tên tài khoản hoặc mật khẩu không đúng.' })
      } else {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Vui long nhap username, password' })
      }
    } catch (e) {
      logger.e(e)
      return res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'Co loi xay ra' })
    }
  }
  const refreshToken = async (req, res) => {
    try {
      const token = req.headers['x-access-token']
      if (token) {
        console.log('tokennn', token)
        const userCMS = serverHelper.decodeToken(token)
        if (userCMS) {
          const u = (await userCMSRepo.getUserCMSById(userCMS._id)).toObject()
          delete u.roles
          delete u.groups
          const newToken = serverHelper.genToken(u)
          await sessionCMSRepo.updateSessionCMSByCondition({
            userCMSId: userCMS._id,
            hash: serverHelper.generateHash(token)
          }, { hash: serverHelper.generateHash(newToken) })
          return res.status(httpCode.SUCCESS).json({ token: newToken })
        }
      }
      res.status(httpCode.UNAUTHORIZED).json({ msg: 'Phiên làm việc không hợp lệ' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'Co loi xay ra' })
    }
  }
  const deleteUserCMS = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await userCMSRepo.deleteUserCMS(id)
        res.status(httpCode.SUCCESS).send({ msg: 'Xóa thành công.' })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getUserCMSById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const userCMS = await userCMSRepo.getUserCMSById(id)
        res.status(httpCode.SUCCESS).send(userCMS)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const changePassword = async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword
      } = req.body
      const username = req.userCMS.username
      if (newPassword && oldPassword) {
        const userCMS = await userCMSRepo.getUserCMS({
          username,
          password: serverHelper.encryptPassword(oldPassword)
        })
        if (userCMS) {
          const u = await userCMSRepo.updateUserCMS(req.userCMS._id, { password: serverHelper.encryptPassword(newPassword) })
          logger.d(userCMS, u)
          res.status(httpCode.SUCCESS).json({ msg: 'Thay đổi mật khẩu thành công.' })
        } else {
          res.status(httpCode.BAD_REQUEST).json({ msg: 'Mật khẩu cũ không chính xác, vui lòng thử lại.' })
        }
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateSelfInfo = async (req, res) => {
    try {
      const body = req.body
      delete body.roles
      delete body.username
      delete body.groups
      delete body.password
      const u = await userCMSRepo.updateUserCMS(req.userCMS._id, body)
      res.status(httpCode.SUCCESS).json({
        ok: true,
        userCMS: u
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateUserCMS = async (req, res) => {
    try {
      const { id } = req.params
      const body = req.body
      if (req.body.isAdministrator) {
        delete body.roles
        body.roles = Object.values(roleConfig)
      }
      if (id && body) {
        const {
          error,
          value: userCMS
        } = await schemaValidator(body, 'UserCMS')
        if (error) {
          return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
        }
        if (userCMS.password) {
          userCMS.password = serverHelper.encryptPassword(userCMS.password)
        }
        if (userCMS.username) {
          const old = await userCMSRepo.getUserCMSByUserCMSname(userCMS.username)
          if (old && String(old._id) !== id) {
            return res.status(httpCode.BAD_REQUEST).json({ msg: 'UserCMSname đã tồn tại, không thể thay đổi thành username này.' })
          }
        }
        // const uDb = await userCMSRepo.getUserCMSById(id)
        // userCMS.isAdministrator = uDb.isAdministrator || 0
        const sp = await userCMSRepo.updateUserCMS(id, userCMS)
        res.status(httpCode.SUCCESS).send({
          msg: 'Sửa thành công.',
          data: sp
        })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const checkUserCMSId = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const sp = await userCMSRepo.checkIdExist(id)
        res.status(httpCode.SUCCESS).send({ exist: !!sp })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }

  const getListUserCMSByIds = async (req, res) => {
    try {
      let ids
      if (!req.query.ids) ids = []
      else ids = (req.query.ids || '').split(',')
      if (!ids.length) {
        return res.status(httpCode.BAD_REQUEST).json({})
      }
      const userCMSs = await userCMSRepo.getListUserCMSByIds(ids)
      return res.status(httpCode.SUCCESS).json({ data: userCMSs })
    } catch (e) {
      logger.e(e)
      return res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }

  const getUserCMS = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids,
        queryType
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? 0 : +sort || 1
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      let pipe = {}
      if (ids) {
        if (ids.constructor === Array) {
          pipe._id = { $in: ids }
        } else if (ids.constructor === String) {
          ids = ids.split(',')
          const idList = []
          for (const id of ids) {
            if (id && id.length === 24) {
              idList.push(ObjectId(id))
            }
          }
          pipe._id = { $in: idList }
        }
      }
      if (!req.userCMS.isAdministrator) {
        pipe.isAdministrator = 0
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      delete search.queryType
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathType = (UserCMS.schema.path(i) || {}).instance || ''
        if (pathType.toLocaleLowerCase() === 'objectid') {
          pipe[i] = ObjectId(vl)
        } else if (pathType === 'Number') {
          pipe[i] = +vl
        } else if (pathType === 'String' && vl.constructor === String) {
          pipe[i] = serverHelper.formatRegex(vl)
        } else {
          pipe[i] = vl
        }
      })
      if (queryType === 'or') {
        pipe = { $or: Object.keys(pipe).map(i => ({ [i]: pipe[i] })) }
      }
      const data = await userCMSRepo.getUserCMSByCondition(pipe, perPage, skip, sort)
      console.log('data', data)
      res.status(httpCode.SUCCESS).json({
        perPage,
        page,
        skip,
        sort,
        ...data
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addUserCMS,
    getUserCMS,
    updateUserCMS,
    deleteUserCMS,
    getUserCMSById,
    checkUserCMSId,
    login,
    refreshToken,
    changePassword,
    updateSelfInfo,
    logout,
    getListUserCMSByIds
  }
}
