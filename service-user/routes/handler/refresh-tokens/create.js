const {
    User,
    RefreshToken
} = require('../../../models');

const Validate = require('fastest-validator');
const v = new Validate();

module.exports = async (req, res) => {
    const userId = req.body.user_id;
    const refreshToken = req.body.refresh_token;

    // Validate Skema
    const schema = {
        refresh_token: 'string',
        user_id: 'number',
    }

    const validate = v.validate(req.body, schema);
    // if validate error
    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid request',
            error: validate
        });
    }

    // if validate success find user by id primary key
    const user = await User.findByPk(userId);
    // if error user not found
    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found'
        });
    }
    // if success user is found
    const createdRefreshToken = await RefreshToken.create({
        token: refreshToken,
        user_id: userId
    });

    return res.json({
        status: 'success',
        message: 'Refresh token created successfully',
        data: {
            id: createdRefreshToken.id
        }
    });
}