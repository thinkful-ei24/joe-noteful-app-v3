const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);