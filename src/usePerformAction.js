/**
 * A hook that performs an action in the context of a react-query for a ReShare
 * patron request and surfaces a success or error message.
 */

import { useMutation, useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import useIntlCallout from './useIntlCallout';

export default (hookReqId) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();
  // POSTing an action
  const { mutateAsync: postAction } = useMutation(
    ['@reshare/stripes-reshare', 'performAction'],
    ({ id, ...data }) => ky
      .extend({ timeout: 45000 }) // longer timeout as some actions take a while
      .post(`rs/patronrequests/${id}/performAction`, { json: data })
  );

  const performAction = async (reqId, action, payload, opt = {}) => {
    let id;
    if (typeof reqId === 'string') id = reqId;
    else if (typeof reqId === 'object') {
      // when given a whole request ensure action is valid
      if (!reqId?.validActions?.some(a => a.actionCode === action)) {
        throw new Error(intl.formatMessage({ id: 'stripes-reshare.action.notValidForState' }));
      }
      id = reqId.id;
    } else throw new Error('performAction missing id');

    try {
      const res = await postAction({ id, action, actionParams: payload || {} });
      if (opt.display !== 'none') {
        if (opt.success) {
          sendCallout(opt.success, 'success');
        } else {
          sendCallout('stripes-reshare.actions.generic.success', 'success', { action: `stripes-reshare.actions.${action}` }, ['action']);
        }
      }
      const invalidateRequest = () => queryClient.invalidateQueries(`rs/patronrequests/${id}`);
      invalidateRequest();

      // unfortunately, actions do not always block until they are fully complete and things
      // (for example responses from ncip) may take a while to show up in the audit log, etc.
      // so we have to expire the cache a few times to keep the record reasonably up to date
      // as that happens.

      // provide noAsync option to exclude an action from these follow-ups
      if (!opt.noAsync) {
        setTimeout(invalidateRequest, 15000);
        setTimeout(invalidateRequest, 45000);
        setTimeout(invalidateRequest, 90000);
      }

      queryClient.invalidateQueries('rs/patronrequests');
      return res;
    } catch (err) {
      if (opt.display !== 'none') {
        const showError = errMsg => {
          if (opt.error) sendCallout(opt.error, 'error', { errMsg });
          else sendCallout('stripes-reshare.actions.generic.error', 'error', { action: `stripes-reshare.actions.${action}`, errMsg }, ['action']);
        };
        if (err?.response?.json) {
          err.response.json().then(res => showError(res.message));
        } else {
          showError(err.message);
        }
      } else throw new Error(err);
      return err;
    }
  };
  return hookReqId ? async (...params) => performAction(hookReqId, ...params) : performAction;
};
