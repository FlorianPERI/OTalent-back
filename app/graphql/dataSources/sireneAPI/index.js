import { RESTDataSource } from '@apollo/datasource-rest';
import Debug from 'debug';

const debug = Debug('app:sireneAPI');

class SireneAPI extends RESTDataSource {
  baseURL = 'https://api.insee.fr/entreprises/sirene/V3/siret/';

  constructor(options) {
    super(options);
    this.token = `Bearer ${process.env.INSEE_API_KEY}`;
  }

  willSendRequest(_path, request) {
    request.headers.authorization = this.token;
  }

  async getSiret(id) {
    try {
      const response = await this.get(id);
      const { denominationUniteLegale } = response.etablissement.uniteLegale;
      const { libelleVoieEtablissement, codePostalEtablissement, libelleCommuneEtablissement } = response.etablissement.adresseEtablissement;

      return {
        siretFound: true,
        denominationUniteLegale,
        libelleVoieEtablissement,
        codePostalEtablissement,
        libelleCommuneEtablissement,
      };
    } catch (error) {
      debug(error);
      return {
        siretFound: false,
        denominationUniteLegale: 'N/A',
        libelleVoieEtablissement: 'N/A',
        codePostalEtablissement: 'N/A',
        libelleCommuneEtablissement: 'N/A',
      };
    }
  }
}
export default SireneAPI;
