const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer(); 
// const fetch = require('node-fetch');
const config = require('../config/config'); // Load configuration

// Handle API requests to `/api/v1/easy/*`
router.post('/',upload.none(), async (req, res) => {
  const { method, body, headers, originalUrl } = req;
  const apiKey = config.apiKey;
  let endTime = new Date();
  console.log('Proxying request to:', req.params[0].replace('/', ''))
  if(req.params[0]=='/forceUnlock/'){

     const startTime = new Date();
      endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000); // 1 hour from startTime
  }
  // Remove `/api` prefix and build the target URL
//   const targetPath = originalUrl.replace('/api', '');
console.log(originalUrl);
console.log(req.body);
  const targetUrl = `https://openapi.heycharge.global${originalUrl}`;
  
  

  try {
    // Initialize fetch options
    const options = {
      method,
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
        ...headers,
      },
    };

    // Handle request body
    if (body && Object.keys(body).length !== 0) {
      if (req.is('multipart/form-data')) {
        options.body = body; // If body is FormData, it will handle its own content type
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
    }

    // Forward request to the external API
    const response = await fetch(targetUrl, options);

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      if (response.status === 402) {
        errorMessage = 'Payment required: Please check your subscription or payment plan.';
      } else if (response.status === 400) {
        const errorData = await response.json();
        errorMessage = `Bad Request: ${errorData.message || response.statusText}`;
      }
      return res.status(response.status).send({ error: errorMessage });
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      return res.json(data);
    } else {
      const responseBody = await response.text();
      res.set('Content-Type', contentType);
      return res.send(responseBody);
    }
  } catch (error) {
    console.error('Error with API request:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
