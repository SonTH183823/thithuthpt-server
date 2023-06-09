module.exports = (container) => {
  const {
    serverHelper,
    httpCode
  } = container.resolve('config')

  const verifyToken = async (req, res, next) => {
    try {
      // return next()
      const token = req.headers['x-access-token'] || ''
      req.user = await serverHelper.verifyToken(token)
      return next()
    } catch (e) {
      // logger.e(e)
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }
  const verifyTokenCMS = async (req, res, next) => {
    try {
      // return next()
      const token = req.headers['x-access-token'] || ''
      req.userCMS = await serverHelper.verifyTokenCMS(token)
      return next()
    } catch (e) {
      // logger.e(e)
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }
  return {
    verifyTokenCMS,
    verifyToken
  }
}
