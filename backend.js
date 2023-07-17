require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const app = express();
app.use(bodyParser.json());

app.post('/api/upload-to-s3', (req, res) => {
  const imageUrl = req.body.imageUrl;

  fetch(imageUrl)
    .then(res => res.buffer())
    .then(buffer => {
      const params = {
        Bucket: 'static2', // your bucket name
        Key: `your-folder/${Date.now()}.jpg`, // replace with your desired key
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      };

      s3.upload(params, function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Failed to upload image' });
        } else {
          console.log(`Image uploaded successfully.  URL is ${data.Location}`);
          res.status(200).json({ message: 'Image uploaded successfully' });
        }
      });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
