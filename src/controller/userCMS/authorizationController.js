module.exports = (container) => {
  const {
    httpCode,
    serverHelper
  } = container.resolve('config')
  const logger = container.resolve('logger')
  const { userRepo } = container.resolve('repo')
  const authorization = async (req, res) => {
    try {
      const token = req.headers['x-access-token']
      const {
        userId,
        method
      } = req.body
      const path = req.body.path.toLowerCase()
      console.log('path', path)
      if (token) {
        const user = await serverHelper.verifyToken(token)
        if (user) {
          const uDb = await userRepo.getUserById(userId)
          if (uDb) {
            const u = uDb.toObject()
            if (u.readonly && method !== 'GET') {
              return res.status(httpCode.SUCCESS).json({
                ok: false,
                msg: 'Bạn chỉ có quyền đọc nội dung.'
              })
            }
            if (u.isAdministrator) {
              return res.status(httpCode.SUCCESS).json({
                ok: true,
                user: u
              })
            }
            return res.status(httpCode.SUCCESS).json({
              ok: false,
              msg: 'Bạn không có quyển để thực hiện chức năng này.'
            })
          }
        }
      }
      res.status(400).json({})
    } catch (e) {
      logger.e(e)
      res.status(httpCode.BAD_REQUEST).json({
        ok: false,
        msg: 'Bạn không được phân quyền để thực hiện tác vụ này.'
      })
    }
  }
  return { authorization }
}
