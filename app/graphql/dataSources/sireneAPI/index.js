import { RESTDataSource } from '@apollo/datasource-rest';
import Debug from 'debug';

const debug = Debug('app:sireneAPI');

/**
 * A class representing the Sirene API data source.
 * @extends RESTDataSource
 */
class SireneAPI extends RESTDataSource {
  constructor(options) {
    super(options);
    this.token = `Bearer ${process.env.INSEE_API_KEY}`;
  }

  willSendRequest(_path, request) {
    request.headers.authorization = this.token;
  }

  /**
     * Retrieves information for a given SIRET number.
     * @param {string} id - The SIRET number to retrieve information for.
     * @returns {Promise<Object>} An object containing the retrieved information.
     */
  async getInformationsBySiret(siret) {
    const url = `https://api.insee.fr/entreprises/sirene/V3.11/siret/${siret}`;
    try {
      const response = await this.get(url);
      const { periodesEtablissement } = response.etablissement;
      let denominationUsuelleEtablissement = null;

      if (Array.isArray(periodesEtablissement) && periodesEtablissement.length > 0) {
        denominationUsuelleEtablissement = periodesEtablissement[0].denominationUsuelleEtablissement;
      }

      debug(denominationUsuelleEtablissement);
      const {
        libelleVoieEtablissement,
        codePostalEtablissement,
        libelleCommuneEtablissement,
        numeroVoieEtablissement,
        typeVoieEtablissement,
      } = response.etablissement.adresseEtablissement;
      const address = numeroVoieEtablissement
        ? `${numeroVoieEtablissement} ${typeVoieEtablissement} ${libelleVoieEtablissement}`
        : `${typeVoieEtablissement} ${libelleVoieEtablissement}`;

      return {
        siretFound: true,
        name: denominationUsuelleEtablissement,
        address,
        postalCode: codePostalEtablissement,
        city: libelleCommuneEtablissement,
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
