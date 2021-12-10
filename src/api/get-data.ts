import axios from 'axios';
import range from 'lodash/range';

import Person from '@/types/Person';
import Planet from '@/types/Planet';

export type SwapiResource = 'people' | 'planets';

const getSwapiData = async ({
  resource,
}: {
  resource: SwapiResource;
}): Promise<Person[] | Planet[] | undefined> => {
  const url = `${process.env.VUE_APP_API_ENDPOINT}/${resource}`;

  try {
    const {
      data: { count, results: firstResult },
    } = await axios.get(url);

    if (firstResult.length) {
      const remainingPages = range(
        2,
        Math.ceil(count / firstResult.length) + 1
      );

      const restResults = await Promise.all(
        remainingPages.map((page) => axios.get(`${url}?page=${page}`))
      );

      return [
        ...firstResult,
        ...restResults.flatMap(({ data }) => data.results),
      ];
    }

    return [];
  } catch (e) {
    console.log(e);
  }
};

export default getSwapiData;
