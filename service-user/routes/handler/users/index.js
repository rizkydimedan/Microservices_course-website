const register = require('./register');
const login = require('./login');
const update = require('./update');
const getUsers = require('./getUsers');
const apiGetUser = require('./apiGetUser');
const logout = require('./logout');
module.exports = {
    register,
    login,
    update,
    getUsers,
    apiGetUser,
    logout
}