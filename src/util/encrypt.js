var bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return bcrypt.hash(password,12)
}
const comparePassword = async (password,currentPassword) =>{
    return bcrypt.compare(password,currentPassword)
}
module.exports = {
    hashPassword, comparePassword
}