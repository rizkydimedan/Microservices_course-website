const bcrypt = require('bcrypt');
const {
    User
} = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async (req, res) => {
    const schema = {
        name: 'string|required:true',
        email: 'string|required:true|email',
        password: 'string|min:6|required:true',
        profession: 'string|optional',
        avatar: 'string|optional',
    };
        // Validate
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }
    // email validation
    const email = req.body.email;
    if (email) {
        const checkEmail = await User.findOne({
            where: {
                email
            }
        });

        if (checkEmail && email !== user.email) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already exists'
            });
        }
    }

    // check password
    const password = await bcrypt.hash(req.body.password, 10);
   
    const {
        name, profession, avatar
    } = req.body;

    // all validation succes
    await user.update({
        name,
        email,
        password,
        profession,
        avatar
    });

    return res.json({
        status: 'success',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            profession: user.profession,
            avatar: user.avatar
        }
    });
}