const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }
});

messagesSchema.options.toJSON = {
  transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
};

module.exports = mongoose.model('messages', messagesSchema);

