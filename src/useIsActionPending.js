/**
 * Returns the number of pending mutations for 'performAction', or, if the optional
 * reqId parameter is provided, the number of pending actions for that particular
 * request id.
 */
import { useIsMutating } from 'react-query';

export default (reqId) => {
  const mutationKey = ['@reshare/stripes-reshare', 'performAction'];
  if (!reqId) {
    return useIsMutating({ mutationKey });
  }
  return useIsMutating({
    mutationKey,
    predicate: m => m?.options?.variables?.id === reqId,
  });
};
