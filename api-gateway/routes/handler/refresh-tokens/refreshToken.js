const jwt = require('jsonwebtoken');
const apiAdaptor = require('../../apiAdaptor');

const {
    URL_SERVICE_USER,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED
} = process.env; //variable config

const api = apiAdaptor(URL_SERVICE_USER);

module.exports = async (req, res) => {
    try {
        // take 2 parameter body refresh token and email
        const refreshToken = req.body.refresh_token;
        const email = req.body.email;

        // check email send from front end or not 
        if (!refreshToken || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and Refresh Token are required'

            });
        };

        // check email or refresh token are in database
        await api.get('/refresh_tokens', {
            params: {
                refresh_token: refreshToken
            }
        });

        // if refresh token is found it
        jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: err.message
                });
            };

            // if email not match with refresh token
            if (email !== decoded.data.email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email not match'
                });
            };

            // if refresh token and email is valid, generate new access token
            const accessToken = jwt.sign({
                data: decoded.data
            }, JWT_SECRET, {
                expiresIn: JWT_ACCESS_TOKEN_EXPIRED
            });

            return res.json({
                status: 'success',
                data: {
                    accessToken
                }
            });
        });

    } catch (error) {

        // if api service media disconected
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                message: 'Service unavailable'
            });
        }

        const {
            status,
            data
        } = error.response;
        return res.status(status).json(data);
    }

}