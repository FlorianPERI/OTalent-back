import { RESTDataSource } from '@apollo/datasource-rest';

class GeoApiGouv extends RESTDataSource {
  baseURL = 'https://api-adresse.data.gouv.fr/search/';

  async getRegion(code) {
    const params = {
      q: code,
    };
    const data = await this.get(this.baseURL, { params });
    return data.features[0].properties.context.split(', ')[2];
  }
}

export default GeoApiGouv;
