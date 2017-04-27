/* eslint no-param-reassign: 0, no-console: 0 */
// Original Gist: https://gist.github.com/dboskovic/23858511bf3c1cbebdbd
import keystone from 'keystone';
import deasync from 'deasync';
import request from 'request';
import path from 'path';
import fs from 'fs';
import s3 from 's3';
import crypto from 'crypto';

const ImageCache = keystone.list('ImageCache');
const tempDir = path.join(process.cwd(), 'temp/');

// Create temp directory if is doesn't exist
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const S3_BUCKET = process.env.S3_BUCKET;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

const s3Client = s3.createClient({
  s3Options: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// TO USE:
// - show a product photo where product has already been loaded from controller and put into scope
// - notice the keystone cloudinary photo method simply returns an http://... url to the cloudinary image
// - the ic() method just requests that url and sends
//    it to s3, and then updates the database when it's available.
//    img(src=ic(product.photo.limit(100,138)))

function checkEnviromentVariables() {
  // Show warning if the required enviroment variables aren't set
  if (S3_BUCKET === undefined ||
    AWS_ACCESS_KEY === undefined ||
    AWS_SECRET_KEY === undefined ||
    CLOUDFRONT_URL === undefined) {
    throw new Error(`Image caching not set up.
      Add the following enviroment variables:
      S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_KEY, CLOUDFRONT_URL`);
  }
}

function getImageHash(url) {
  const md5 = crypto.createHash('md5');
  const hash = md5.update(url).digest('hex');
  return hash;
}

function getImage(hash) {
  let response;
  let done = false;
  ImageCache.model.where({
    hash,
  }).findOne((err, data) => {
    if (err) {
      console.error(err);
    }
    response = data;
    done = true;
  });
  deasync.loopWhile(() => done === false);
  return response;
}

function uploadToS3(imageCache, params) {
  // Upload image to S3
  const uploader = s3Client.uploadFile(params);
  uploader.on('error', (err) => {
    console.error(err);
    imageCache.remove();
  });
  uploader.on('end', () => {
    imageCache.uploaded = true;
    imageCache.save();
  });
}

function bindImageCache(req, res, next) {
  res.locals.ic = function ic(imageUrl) {
    checkEnviromentVariables();
    const hash = getImageHash(imageUrl);
    const dbImage = getImage(hash);

    // No cache entry in the db, create it
    if (!dbImage || !dbImage.uploaded) {
      if (!dbImage) {
        // Create image cache model
        ImageCache.model.create({
          hash,
          uploaded: false,
        }, (err, imageCache) => {
          const localFile = `${tempDir}/${hash}.jpg`;
          // Download image to local filesystem
          request(imageUrl)
            .pipe(fs.createWriteStream(localFile))
            .on('error', (error) => {
              console.error(error);
            })
            .on('close', () => {
              const params = {
                localFile,
                s3Params: {
                  Bucket: S3_BUCKET,
                  Key: `${hash}.jpg`,
                  ACL: 'public-read',
                  ContentType: 'image/jpeg',
                },
              };
              uploadToS3(imageCache, params);
            });
        });
      }
      return imageUrl;
    }

    // Image cache exists, return cached image url
    return `${req.protocol}://${CLOUDFRONT_URL}/${hash}.jpg`;
  };

  next();
}

module.exports = bindImageCache;
