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

  const performAction = async (reqId, action, payload, msgs = {}) => {
    let id;
    if (typeof reqId === 'string') id = reqId;
    else if (typeof reqId === 'object') {
      // when given a whole request ensure action is valid
      if (!reqId?.validActions?.includes(action)) {
        throw new Error(intl.formatMessage({ id: 'stripes-reshare.action.notValidForState' }));
      }
      id = reqId.id;
    } else throw new Error('performAction missing id');

    try {
      const res = await postAction({ id, action, actionParams: payload || {} });
      if (msgs.display !== 'none') {
        if (msgs.success) {
          sendCallout(msgs.success, 'success');
        } else {
          sendCallout('stripes-reshare.actions.generic.success', 'success', { action: `stripes-reshare.actions.${action}` }, ['action']);
        }
      }
      queryClient.invalidateQueries(`rs/patronrequests/${id}`);
      queryClient.invalidateQueries('rs/patronrequests');
      return res;
    } catch (err) {
      if (msgs.display !== 'none') {
        const showError = errMsg => {
          if (msgs.error) sendCallout(msgs.error, 'error', { errMsg });
          else sendCallout('stripes-reshare.actions.generic.error', 'error', { action: `stripes-reshare.actions.${action}`, errMsg }, ['action']);
        };
        if (err?.response?.json) {
          err.response.json().then(res => showError(res.message));
        } else {
          showError(err.message);
        }
      }
      return err;
    }
  };
  return hookReqId ? async (...params) => performAction(hookReqId, ...params) : performAction;
};
