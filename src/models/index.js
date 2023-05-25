const joi = require('@hapi/joi')
const mongoose = require('mongoose')
const typeMapping = {
  string: String,
  array: Array,
  number: Number,
  boolean: Boolean,
  object: Object
}

const joi2MongoSchema = (joiSchema, special = {}, schemaOnly = {}, joiOnly = {}) => {
  const { $_terms: { keys } } = joiSchema
  let schemaObj = {}
  keys.forEach(i => {
    const { key, schema: { type } } = i
    if (joiOnly[key]) {
      return
    }
    if (type === 'array' && special[key]) {
      schemaObj[key] = special[key]
    } else {
      schemaObj[key] = {
        type: typeMapping[type],
        ...(special[key] || {})
      }
    }
  })
  schemaObj = { ...schemaObj, ...schemaOnly }
  return mongoose.Schema(schemaObj)
}

module.exports = container => {
  container.registerValue('ObjectId', mongoose.Types.ObjectId)
  const User = require('./user/user.model')(joi, mongoose)
  const Ping = require('./user/ping.model')(joi, mongoose)
  const Login = require('./joi/login.model')(joi)
  const Session = require('./user/session.model')(joi, mongoose)
  const Category = require('./news/category.model')(joi, mongoose, { joi2MongoSchema })
  const News = require('./news/news.model')(joi, mongoose, { joi2MongoSchema })
  const Tag = require('./news/tag.model')(joi, mongoose, { joi2MongoSchema })
  const UserCMS = require('./userCMS/userCMS.model')(joi, mongoose)
  const SessionCMS = require('./userCMS/sessionCMS.model')(joi, mongoose)
  const schemas = {
    mongoose: {
      User, Session, Ping, UserCMS, SessionCMS
    },
    joi: { Login },
    News,
    Category,
    Tag
  }
  const schemaValidator = (obj, type) => {
    const schema = schemas.joi[type]
    if (schema) {
      return schema.validate(obj, {
        allowUnknown: true
      })
    }
    return { error: `${type} not found.` }
  }
  return { schemas, schemaValidator }
}
