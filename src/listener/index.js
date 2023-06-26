module.exports = container => {
  const all = async () => {

    console.log('success')
  }
  const all1 = async () => {

    console.log('success')
  }
  setInterval(all, process.env.TIME_RUN || 8640000)
  setInterval(all1, process.env.TIME_RUN || 8640000)
}
