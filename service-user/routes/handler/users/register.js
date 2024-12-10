const bcrypt = require('bcrypt');
const {
    User
} = require('../../../models');
const Validator = require('fastest-validator');

const v = new Validator();
// validasi
// install lib npm install fastest-validator

module.exports = async (req, res) => {
    const schema = {
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            required: true
        },
        password: 'string|min:6',
        profession: 'string|optional'
    }
    // validate
    const validate = v.validate(req.body, schema);
    if (validate.lenght) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid validate request'
        });
    }
    // email
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (user) {
        return res.status(409).json({
            status: 'error',
            message: 'Email already exist'
        });
    }
    // password
    const password = await bcrypt.hash(req.body.password, 10);
    // insert to database 
    const data = {
        password,
        name: req.body.name,
        email: req.body.email,
        profession: req.body.profession,
        role: 'student'
    };
    // create 
    const createUser = await User.create(data);
    return res.json({
        status: 'success',
        data: {
            id: createUser.id
        }
    })
}