module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { verifyInternalToken } = container.resolve('middleware')
  const { sdpController } = container.resolve('controller')

  app.get(`${basePath}/sdp/news`, verifyInternalToken, sdpController.getListNewsBySDP)
  app.get(`${basePath}/sdp/news/:id`, verifyInternalToken, sdpController.getNewsByIdSDP)

  app.get(`${basePath}/sdp/tagNews`, verifyInternalToken, sdpController.getListTagNewsBySDP)
  app.get(`${basePath}/sdp/tagNews/:id`, verifyInternalToken, sdpController.getTagNewsByIdSDP)

  app.get(`${basePath}/sdp/cateNews`, verifyInternalToken, sdpController.getListCateNewsBySDP)
  app.get(`${basePath}/sdp/cateNews/:id`, verifyInternalToken, sdpController.getCateNewsByIdSDP)
  app.get(`${basePath}/sdp/cateNewsBySlug/:slug`, verifyInternalToken, sdpController.getCateNewsBySlugSDP)

  app.get(`${basePath}/sdp/newsRandom`, verifyInternalToken, sdpController.getRandomNewsSDP)
}
