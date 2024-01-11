// services/bloodRequestService.js
// const sql = require('mssql');
// const BloodRequestSchema = require('../Models/bloodRequestModel');
// const dbConfig = require('../dbConfig');

// class BloodRequestService {
//   async requestBlood(hospital, city, town, bloodType, units, contactEmail) {
//     try {
//       const pool = await sql.connect(dbConfig); // You need to provide your MSSQL connection configuration in 'config'

//       const request = new sql.Request(pool);
//       request.input('hospital', sql.NVarChar, hospital);
//       request.input('city', sql.NVarChar, city);
//       request.input('town', sql.NVarChar, town);
//       request.input('bloodType', sql.NVarChar, bloodType);
//       request.input('units', sql.Int, units);
//       request.input('contactEmail', sql.NVarChar, contactEmail);

//       const result = await request.query(`INSERT INTO BloodRequests OUTPUT INSERTED.* VALUES (@hospital, @city, @town, @bloodType, @units, @contactEmail)`);

//       return result.recordset[0];
//     } catch (error) {
//       throw error;
//     }
//   }

//   async queryBloodRequests() {
//     try {
//       const pool = await sql.connect(dbConfig);

//       const result = await pool.request().query('SELECT * FROM BloodRequests');
//       return result.recordset;
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// module.exports = BloodRequestService;
