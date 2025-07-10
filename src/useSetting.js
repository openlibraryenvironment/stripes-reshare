import { useMemo } from 'react';
import useSettings from './useSettings';

/**
 * There aren't so many settings that it's worth making more requests to get them,
 * instead let's grab them all and filter as needed.
 * 
 * section is optional, can search for key in all sections.
 * 
 * Return value is an object with, at minimum, an `isSuccess` property.
 * - `isSuccess` will be false until the settings have been fetched for the first time
 * - if a setting in the system matches `key, section`, its properties will also be included,
 *   most importantly `value`
 *
 */
const useSetting = (key, section) => {
  const query = useSettings();
  return useMemo(() => {
    if (!query.isSuccess) return { isSuccess: false };
    const match = query.data?.find(s => s.key === key
      && (!section || (s.section === section)));
    const result = match ? { isSuccess: true, ...match } : { isSuccess: true }
    return result;
  }, [key, section, query.data, query.isSuccess]);
};

export default useSetting;
