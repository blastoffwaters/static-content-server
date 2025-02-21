# Static Content Server
A simple, NGINX-based web server for serving static content, namely images.
**Bow's version of this can be found at https://imgsrv.blastoffwaters.com.**

## Why use this?
This image only provides a few changes over NGINX, it isn't very different.
It is meant so we can simply deploy this across multiple nodes.
It relies on a storage volume being available that contains the files you want to serve.

## Setup
1. Deploy the image using whatever method you choose.
1.1. Make sure you have the environment variables set:
  - `SERVER_DOMAIN`: Only needed for Let's Encrypt, don't set if you don't want the app to manage certs for you.
  - `ADMIN_EMAIL`: Will be written to the default README, and used for Let's Encrypt as well.

## Credits
- Nginx is the main base of this project. We have included a copy of their license for legal reasons in `NGINX_ORIGINAL_LICENSE`.
- Example photos from [picsum.photos](https://picsum.photos).