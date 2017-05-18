import {cloudinaryCloudName,cloudinaryApiKey,cloudinaryApiSecret} from './../../lib/constants.js';

Cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret
});

