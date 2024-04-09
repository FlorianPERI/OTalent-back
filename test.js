import GeoApiGouv from './app/graphql/dataSources/GeoApiGouv/index.js';

const geoapi = new GeoApiGouv();

const test = await geoapi.getRegion(35000);
console.log(test);
