import { useOkapiQuery } from './useOkapiQuery';

/**
 * A useOkapiQuery for all the settings
 */
const useSettings = () => {
  return useOkapiQuery('rs/settings/appSettings', {
    searchParams: {
      // the presenece of a filter containing "hidden" includes hidden settings
      // and by not actually filtering we get all the other ones too
      filters: 'hidden',
      perPage: '1000',
    },
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 2 * 60 * 60 * 1000
  });
};

export default useSettings;
