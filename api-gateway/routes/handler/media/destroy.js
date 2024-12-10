const apiAdaptor = require('../../apiAdaptor');

const {
    URL_SERVICE_MEDIA
} = process.env; //variable config

const api = apiAdaptor(URL_SERVICE_MEDIA);

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const media = await api.delete(`/media/${id}`);
        return res.json(media.data);
    } catch (error) {

        // if api service media disconected
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({status:'error', message: 'Service unavailable'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }

}