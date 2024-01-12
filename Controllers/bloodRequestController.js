// bloodRequestController.js
import fetch from 'node-fetch';
import { BloodRequest } from '../Models/bloodRequestModel.js';
import { connectToDatabase, getPool } from '../db.js';
import sql from 'mssql';

export async function requestBlood(req, res) {
  const { hospital, city, town, bloodType, units, contactEmail } = req.body;
  console.log('Received request body:', req.body);

  // Validate required fields
  if (!hospital || !city || !town || !bloodType || !units || !contactEmail) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newBloodRequest = new BloodRequest(hospital, city, town, bloodType, units, contactEmail);

  try {
    await connectToDatabase();

    const pool = getPool();
    const request = pool.request();
    request.input('hospital', sql.NVarChar, hospital);
    request.input('city', sql.NVarChar, city);
    request.input('town', sql.NVarChar, town);
    request.input('bloodType', sql.NVarChar, bloodType);
    request.input('units', sql.Int, units);
    request.input('contactEmail', sql.NVarChar, contactEmail);

    console.log("New Blood Request " + newBloodRequest);

    const result = await request.query(`
      INSERT INTO BloodRequests (hospital, city, town, bloodType, units, contactEmail)
      VALUES (@hospital, @city, @town, @bloodType, @units, @contactEmail)
    `);

    console.log("Result: " + result);

    if (result.rowsAffected && result.rowsAffected[0] > 0) {

      await invokeSearchBloodAPI();

      return res.status(201).json({ message: 'Blood request added successfully.' });
    } else {
      return res.status(500).json({ error: 'Failed to add blood request.' });
    }
  } catch (error) {
    console.error('Error requesting blood:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function invokeSearchBloodAPI() {
  const apiGatewayBaseUrl = 'https://blooddonorsystemapigateway.azure-api.net';
  const searchBloodEndpoint = '/api/search-blood';
  const fullUrl = apiGatewayBaseUrl + searchBloodEndpoint;
  try {
    const searchBloodResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (searchBloodResponse.ok) {
      const searchBloodData = await searchBloodResponse.json();
      console.log('Search Blood API response:', searchBloodData);
    } else {
      console.error('Failed to invoke Search Blood API:', searchBloodResponse.statusText);
    }
  } catch (error) {
    console.error('Error invoking Search Blood API:', error);
  }
}

export async function getBloodRequests(req, res) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Query blood requests from the database
    const queryResult = await getPool()
      .request()
      .query(`
        SELECT * FROM BloodRequests
      `);

    // Return the blood requests
    const bloodRequests = queryResult.recordset;
    res.status(200).json({ bloodRequests });
  } catch (error) {
    console.error('Error retrieving blood requests from the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}