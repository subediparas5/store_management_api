const bcrypt = require('bcryptjs');

const HashPassword = async (inputPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('deruccO' + inputPassword + 'rorrEniarB', salt)
    return hashedPassword;
}

const ComparePassword = async (inputPassword, userPassword) => {
    const validPass = await bcrypt.compare('deruccO' + inputPassword + 'rorrEniarB', userPassword);
    return validPass;
}

module.exports.hashPassword = HashPassword;
module.exports.comparePassword = ComparePassword;