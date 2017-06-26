const mongoose = require('mongoose');
const uuid = require('uuid/v4');

let sanitizerPlugin = require('mongoose-sanitizer');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const schema = new mongoose.Schema({
  id: { type: String, default: () => { return uuid() }, index: { unique: true } },
  created_at: { type: Date, default: Date.now },
  text: String,
  owner: { type: String, default: 'public' }
});

// sanitize all user input on this object before saving
// this strips mongo-insecure elements
schema.plugin(sanitizerPlugin);

// decode html entities
let encodeHTML = function(next) {
  this.text = entities.encodeNonUTF(this.text);
  next();
};

schema.pre('save', encodeHTML);
schema.pre('update', encodeHTML);

// decode (some) html entities
schema.post('find', function() {
  this.text = entities.decode(this.text);
});

const model = mongoose.model('task', schema);

module.exports = {
    schema: schema,
    model: model,

    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete'
};
