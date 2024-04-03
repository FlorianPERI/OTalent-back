import { RESTDataSource } from '@apollo/datasource-rest';
import Debug from 'debug';
import 'dotenv/config';

const debug = Debug('app:bingMapAPI');

class BingMapAPI extends RESTDataSource {
  locationURL = 'http://dev.virtualearth.net/REST/v1/Locations';

  routeURL = 'https://dev.virtualearth.net/REST/V1/Routes?waypoint.';

  constructor(options) {
    super(options);
    this.token = process.env.BING_MAPS_API_KEY;
  }

  async getCoordinates(code) {
    const params = {
      postalCode: code,
      countryRegion: 'FR',
      key: process.env.BING_MAPS_API_KEY,
    };
    const data = await this.get(this.locationURL, { params });
    return data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
  }

  async getDistance(firstPostalCode, secondPostalCode) {
    const firstLocation = await this.getCoordinates(firstPostalCode);
    const secondLocation = await this.getCoordinates(secondPostalCode);
    const params = {
      'waypoint.1': [firstLocation[0], firstLocation[1]].toString(),
      'waypoint.2': [secondLocation[0], secondLocation[1]].toString(),
      key: process.env.BING_MAPS_API_KEY,
    };
    try {
      const data = await this.get(this.routeURL, { params });
      return data.resourceSets[0].resources[0].travelDistance;
    } catch (error) {
      return null;
    }
  }
}

export default BingMapAPI;
