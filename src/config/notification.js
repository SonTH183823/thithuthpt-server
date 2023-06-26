module.exports = container => {
  const firebaseAdmin = container.resolve('firebaseAdmin')
  const handlePushFCM = async (messages) => {
    try {
      const a = await firebaseAdmin.messaging().send(messages)
      console.log(a)
    } catch (e) {
      console.log(e)
    }
  }
  return {
    handlePushFCM
  }
}
