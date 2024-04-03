import BingMapAPI from './app/graphql/dataSources/bingMapAPI/index.js';

const api = new BingMapAPI();

const firstLocation = await api.getCoordinates(75000);
const secondLocation = await api.getCoordinates(35000);
// console.log(firstLocation);
// console.log(secondLocation);

const distance = await api.getDistance(firstLocation, secondLocation);
// console.log(distance);

const newDistance = await api.getDistance(35000, 75000);
console.log(newDistance);
