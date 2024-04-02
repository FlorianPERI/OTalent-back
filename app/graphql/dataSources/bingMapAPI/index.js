import { RESTDataSource } from '@apollo/datasource-rest';
import Debug from 'debug';
import 'dotenv/config';

const debug = Debug('app:bingMapAPI');

class BingMapAPI extends RESTDataSource {
  baseURL = 'http://dev.virtualearth.net/REST/v1/Locations';

  constructor(options) {
    super(options);
    this.token = process.env.BING_MAPS_API_KEY;
  }

  // async getLocalisation(postalCode) {
  //   try {
  //     const response = await this.
  //   }
  // }
}
