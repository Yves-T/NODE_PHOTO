# Photo gallery app

This app let users upload photos to the Node Js backend and stores
them in  an AWS S3 bucket. The user can add votes to a photo.
AWS CloudFront is used to set up a CDN for the images.

# Technologies and libraries

* Node Js & express
* Mongoose and Mongo Db to handle NoSql persistence.
* websockets & socket.io
* Bluebird Js to handle async programming
* Knock to handle upload S3 bucket
* Formidable to handle file upload
* GraphicsMagick to resize images before uploading


## Config files

The config files are not commited for security reasons. If you want
to run this app you need to create two json files in app/config with
following structure

```json
{
  "host": "http://localhost:3000",
  "S3AccessKey": "",
  "S3Secret": "",
  "S3Bucket": "",
  "dbURL": "mongodb://localhost/photogrid",
  "sessionSecret": "mysecret",
  "googleAuth": {
    "clientID": "",
    "clientSecret": "",
    "callbackURL": "http://localhost:3000/auth/google/callback",
    "scope": [
      "profile",
      "email"
    ]
  }
}
```
