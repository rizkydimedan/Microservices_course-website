const apiAdaptor = require('../../apiAdaptor');

const {
    URL_SERVICE_COURSE
} = process.env; //variable config

const api = apiAdaptor(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
    try {
        const mentors = await api.get('/api/mentors');
        return res.json(mentors.data);
    } catch (error) {

        // if api service media disconected
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({status:'error', message: 'Service unavailable'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }

}