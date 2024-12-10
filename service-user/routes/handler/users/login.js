const bcrypt = require('bcrypt');
const {
    User
} = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async (req, res) => {
    // validate
    const schema = {
        email: 'email|empty:false',
        password: 'string|min:6|empty:false',
    }

    const validate = v.validate(req.body, schema);
    if (validate.lenght) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    // if validate not error check data in database
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    // if user not found
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'Email not found'
        });
    }
    // if user found, check password
    const inValidPassword = await bcrypt.compare(req.body.password, user.password /* array before hash and after hash */ )
    if (!inValidPassword) {
        return res.status(404).json({
            status: 'error',
            message: 'Invalid password'
        });
    }

    // if all valid
    res.json({
        status: 'success',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            profession: user.profession
        }
    });
}