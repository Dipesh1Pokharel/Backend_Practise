const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const https = require('https'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({limit: '1000mb'}));

const router = express.Router();
//Document Datastax
//GET PRODUCTS 
app.use('/api/products', async(req, res) => {
    try {
      const response = await axios.get('https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products?page-size=3', {
        headers: {
          'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
        }
      });
      res.json(response.data);
    }catch(error) {
      console.error(error);
    }
  });
  //ADD PRODUCT

  app.use('/api/add-products', async(req, res) => {
    const requestData = req.body;
    try {
      const response = await axios.post('https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products', 
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
        }
      });
      res.json(response.data);
    }catch(error) {
      console.error(error);
    }
  });
  
//DELETE PRODUCT
  app.delete('/api/del-products/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const response = await axios.delete(`https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products/${productId}`, {
            headers: {
                'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
    }
});
//UPDATE PRODUCT

app.put('/api/put-products/:productId', async (req, res) => {
  const productId = req.params.productId;
  const updatedData = req.body;
  try {
      const response = await axios.put(`https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products/${productId}`, updatedData, {
          headers: {
              'Content-Type': 'application/json',
              'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
          }
      });
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//PATCH 
app.patch('/api/patch-products/:productId', async (req, res) => {
  const productId = req.params.productId;
  const updatedData = req.body; // This line captures the updated data from the request body
  try {
      const response = await axios.patch(`https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products/${productId}`, updatedData, {
          headers: {
              'Content-Type': 'application/json',
              'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
          }
      });
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  