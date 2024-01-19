# Ghopher api 
API to facilitate wallet transactions and interacting with blockchain RPCs

## Structure

An Express API on top of Serverless framework, to make deployment to an AWS enviroment easier.
- The Express API code lives in `index.js`
- It is deployed to AWS Lambda, but the routing is all still delegated to the Express application itself 

## Running Locally

1. `cd ghopher-api` then `npm i`
2. `sls offline start` will run the functions locally, the port is set to 8000 as a default, `http://localhost:8000/`
3. `sls deploy` to deploy changes


