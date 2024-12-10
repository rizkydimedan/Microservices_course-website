'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('users', [
      {
       name: "Rizky",
       profession: "Admin Micro",
       role: "admin",
       email: "asterixkun560@gmail.com",
       password: await bcrypt.hash('sarangtawon123', 15),
       created_at: new Date(),
       updated_at: new Date()
      }, 
      {
        name: "Widya",
        profession: "Guru",
        role: "admin",
        email: "asterixkun720@gmail.com",
        password: await bcrypt.hash('sarangtawon124', 15),
        created_at: new Date(),
        updated_at: new Date()
       }
    ], {});
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('users', null, {});
     
  }
};
