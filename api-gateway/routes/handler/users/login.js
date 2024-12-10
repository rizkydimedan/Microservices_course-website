const apiAdaptor = require('../../apiAdaptor');
const jwt = require('jsonwebtoken')
const {
    URL_SERVICE_USER,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_SECRET_REFRESH_TOKEN_EXPIRED
} = process.env; //variable config


const api = apiAdaptor(URL_SERVICE_USER);

module.exports = async (req, res) => {
    try {
        const user = await api.post('/users/login', req.body);
        // return res.json(userLogin.data);
        // variable from axios user.data.>data refer data : 5
        const data = user.data.data;

        // if (!data || !data.id) {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: "Invalid response from login API: 'user_id' is missing."
        //     });
        // }

        // Secret Token /* data payload */
        const token = jwt.sign({ data }, JWT_SECRET, {expiresIn: JWT_ACCESS_TOKEN_EXPIRED });

        // Refresh Token /* data payload */ 
        const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, {expiresIn: JWT_SECRET_REFRESH_TOKEN_EXPIRED});
       
        // save to refresh_token table > service_user
        await api.post('/refresh_tokens', { refresh_token: refreshToken, user_id: data.id });

        return res.json({
            status: 'success',
            data: {
                token,
                refresh_token: refreshToken,
            }
        });

        
    } catch (error) {

        // if api service media disconected
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({status:'error', message: 'Service unavailable'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }

}


// Payload JWT
// "status": "success",
//     "data": 5,
//     "name": "asterix",
//     "email": "asterix@gmail.com",
//     "role": "student",
//     "avatar": null,
//     "profession": null