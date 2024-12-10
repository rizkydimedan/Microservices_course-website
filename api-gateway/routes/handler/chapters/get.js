const apiAdaptor = require('../../apiAdaptor');

const {
    URL_SERVICE_COURSE
} = process.env; //variable config

const api = apiAdaptor(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const chapter = await api.get(`/api/chapters/${id}`);
        return res.json(chapter.data);
    } catch (error) {

        // if api service media disconected
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({status:'error', message: 'Service unavailable'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }

}