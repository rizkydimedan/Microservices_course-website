const { RefreshToken } = require('../../../models');

module.exports = async (req, res) => {

    // query param
    const refreshToken = req.query.refresh_token;
    const token = await RefreshToken.findOne({
        where: { 
            token: refreshToken
        } 
    });

    if (!token){
        return res.status(400).json({status:'error', message: 'Invalid refresh token'
        });
    }

    return res.json({
        status: 'success',
        message: 'Refresh token is valid',
        data: token
    });
}