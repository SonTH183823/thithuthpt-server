module.exports = container => {
  const { schemas } = container.resolve('models')
  const redisHelper = container.resolve('redisHelper')
  const keyPrefix = 'saveLastPing'
  const saveLastPing = (id, deviceType, loginType) => {
    const key = `${keyPrefix}-loginType-${loginType}-${id}-deviceType${deviceType}`
    return redisHelper.set(key, Math.floor(Date.now() / 1000), '2m')
  }
  // viet them ham tinh xem co bao nhieu nguoi online tu data nay
  return { saveLastPing }
}
