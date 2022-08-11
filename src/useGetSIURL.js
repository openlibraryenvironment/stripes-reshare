/** Returns a function that takes an id and returns an SI URL or null if none configured */
import { useStripes } from '@folio/stripes/core';

export default () => {
  const siCfg = useStripes().config?.reshare?.sharedIndex;

  return id => {
    if (!id || !siCfg?.ui) return null;
    switch (siCfg?.type) {
      case 'folio':
        return `${siCfg.ui}/inventory/view/${id}`;
      case 'vufind':
        return `${siCfg.ui}/Record/${id}`;
      default:
        return `${siCfg.ui}${id}`;
    }
  };
};
