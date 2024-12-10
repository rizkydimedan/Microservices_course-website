const apiAdaptor = require('../../apiAdaptor');

const {
    URL_SERVICE_USER
} = process.env; //variable config

const api = apiAdaptor(URL_SERVICE_USER);

module.exports = async (req, res) => {
    try {

        // gunakan id yang sudah di decode verifyToken.js
        const id = req.user.data.id;
        const user = await api.put(`/users/${id}`, req.body);
        return res.json(user.data);
    } catch (error) {

        // if api service media disconected
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({status:'error', message: 'Service unavailable'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }

}