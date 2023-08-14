/**
 * useIntlCallout: A hook that returns a function:
 *   setMessage(translationKey, type, values, valuesToTranslate, timeout)
 *
 * ...where translationKey is the message and valuesToTranslate indicate which
 * properties of values are in fact translation keys that must first be translated
 * before passing into formatMessage.
 * 
 * Timeout is in ms.
 */

import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CalloutContext } from '@folio/stripes/core';

const DEFAULT_TIMEOUT = 8000;

export default () => {
  const callout = useContext(CalloutContext);
  const intl = useIntl();

  return (key, type, values, valuesToTranslate, timeout = DEFAULT_TIMEOUT) => {
    let intlValues;
    if (values) {
      intlValues = Object.fromEntries(Object.entries(values).map(ent => {
        if (Array.isArray(valuesToTranslate) && valuesToTranslate.includes(ent[0])) {
          return [ent[0], intl.formatMessage({ id: ent[1] })];
        }
        return ent;
      }));
    }
    return callout.sendCallout({ message: <FormattedMessage id={key} values={intlValues} />, type, timeout });
  };
};
