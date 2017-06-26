const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer');
const uuid = require('uuid/v4');

const schema = new mongoose.Schema({
  id: { type: String, default: () => { return uuid() }, index: { unique: true } },
  created_at: { type: Date, default: Date.now },
  source: String,
  profile: Object,
  token: String,
  tokenSecret: String
});

// sanitize all user input on this object before saving
// this strips mongo-insecure elements
schema.plugin(sanitizerPlugin);

const model = mongoose.model('user', schema);

module.exports = {
    schema: schema,
    model: model,

    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete'
};
