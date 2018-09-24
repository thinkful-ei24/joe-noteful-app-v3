const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function(password) {
  return password === this.password;
};

module.exports = mongoose.model('User', userSchema);