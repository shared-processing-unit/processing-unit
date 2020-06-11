# SPU-Processing-Unit

[![Build Status](https://travis-ci.com/rkram3r/spu.processing-unit.svg?token=SeYH39q643bu3sRAgn3K&branch=master)](https://travis-ci.com/rkram3r/spu.processing-unit)

Processing Units are actors usually provided by websites.
The repository contains the code that is executed on the SPU. This includes the algorithms and the communication layer with the backend.

## Develop

        $ yarn

## Testing

        $ yarn test

## Deployment

For deployment, the S3 Bucket and WebSocketURI must be specified in `.travis.yml` - script.

Travis handles the continious integration.
Just merge branch to master.
