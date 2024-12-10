const axios = require('axios');
const { TIMEOUT } = process.env;

// Reuqest API jika tidak dada respon 5 detik

module.exports = (baseUrl) => {
    return axios.create({
        baseURL: baseUrl,
        timeout: parseInt(TIMEOUT) //parsing string menjadi int
    });
}