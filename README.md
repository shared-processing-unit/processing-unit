# SPU-Processing-Unit

[![Build Status](https://travis-ci.com/shared-processing-unit/spu-processing-unit.svg?branch=master)](https://travis-ci.com/shared-processing-unit/spu-processing-unit)

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
