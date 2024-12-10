const apiAdaptor = require('../../apiAdaptor');

const {
    URL_SERVICE_COURSE
} = process.env; //variable config

const api = apiAdaptor(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
    try {
        const userId = req.user.data.id;
      

        const myCourse = await api.get('/api/my-courses', {
            params: { user_id: userId }
        });
        return res.json(myCourse.data);
    } catch (error) { 

        // if api service media disconected
        if(error.code === 'ECONNREFUSED'){
            return res.status(500).json({status:'error', message: 'Service unavailable'});
        }

        const { status, data } = error.response;
        return res.status(status).json(data);
    }

}