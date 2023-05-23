module.exports = (joi, deviceTypes, loginMethod) => {
  return joi.object({
    token: joi.string().optional(),
    name: joi.string().optional(),
    avatar: joi.string().optional(),
    code: joi.string().optional(),
    domain: joi.string().optional()
  })
}
