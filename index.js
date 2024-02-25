const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const axiosRetry = require('axios-retry');
// const fetch = require('node-fetch')  ;
const multer = require('multer');
const https = require('https'); 
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({limit: '1000mb'}));

const storage = multer.memoryStorage();
const upload =  multer({
  storge: storage,
  limits : {fileSize: 10000000000}
});
const router = express.Router();



//Document Datastax 
 //GET PRODUCT BY ID
  app.use('/api/products/:productId', async (req, res)=>{
    const productId = req.params.productId;
    try{
      const response = await axios.get(`https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products/${productId}`,{
        headers: {
          'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
        }
      });
      res.status(201).json(response.data);
    }
    catch(err){
      res.status(500).json(err);


    }
  });
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
  app.post("/api/add-products", upload.single('image'), async (req, res) => {
    try {
      // Extract product data from request body
      const productData = req.body;
      
      // Extract image buffer from the request file
      const imageBuffer = req.file.buffer;
      
      // Encode image buffer to base64
      const base64Image = imageBuffer.toString('base64');
  
      // Add base64 image to product data
      productData.image = base64Image;
  
      // Send product data to DataStax database
      const response = await axios.post('https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products', 
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
          }
        });
  
      res.json(response.data);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });

  // app.use('/api/add-products', async(req, res) => {
  //   const requestData = req.body;
  //   try {
  //     const response = await axios.post('https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products', 
  //     requestData,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
  //       }
  //     });
  //     res.json(response.data);
  //   }catch(error) {
  //     console.error(error);
  //   }
  // });
  
//DELETE PRODUCT
  app.delete('/api/del-products/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const response = await axios.delete(`https://5473a948-897c-446a-a79c-d9f57e8071e0-us-east1.apps.astra.datastax.com/api/rest/v2/namespaces/document/collections/products/${productId}`, {
            headers: {
                'X-Cassandra-Token': 'AstraCS:TjkSeDazlJEbcCMHPUXkKwPn:6454b234535e9d33153d4f70b86f5c5a8ff19331645ecf3453afd0eacdaea026'
            }
        });

        res.status(201).json("Status : Sucess");
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
app.use('/api/weather-app/:city', async(req, res) => {
  
  try {
    const city = req.params.city;
    // const options = {  method: 'GET',
    //   headers: {    'key': '1f7566f4399946cd85a231355241202' 
    // }};
    //  const response = await axios.get('http://api.weatherapi.com/v1/current.json?q=London&aqi=yes', options);	
    // const result = await response.json();	
    // console.log(result);
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=1f7566f4399946cd85a231355241202&q=${city}&aqi=yes`);
    // console.log(JSON.stringify(response));
    const datas= response.data;
    res.send(`Name: ${datas.location.name} - 
    Country : ${datas.location.country} -
    Time : ${datas.location.localtime}-
    Condition : ${datas.current.condition.text} -
    Temperature in C : ${datas.current.feelslike_c} -
    Icon:  ${datas.current.condition.icon}-
    <img src = "${datas.current.condition.icon}"> </img>`);
    console.log(datas.current.condition);
    // res.json(datas);

    // res.send(response.data);

    // // return await response.json();

  }catch(error) {
    console.error(error); //error catc
  }
});
// upload img with datas


//other way to upload image
app.post("/upload", upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const decodeImage = Buffer.from(imageBuffer);
    const base64Image = decodeImage.toString('base64');
    res.status(200).send( base64Image );
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});







app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  