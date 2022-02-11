import { useQuery } from 'react-query';
import { omit } from 'lodash';
import { useOkapiKy } from '@folio/stripes/core';
// TODO: ReShare is not using new enough Stripes for NS
// import { useOkapiKy, useNamespace } from '@folio/stripes/core';

// I confirmed with a react-query maintainer what the docs imply: you can share
// the same key between queries that use different values for staleTime and
// cacheTime. The longest cacheTime will be used and refetching will happen
// based on what's currently active.
//
// per TkDodo "if you re-fetch stale queries, we look at all observers. if one
// says the query is stale, the other says it's not stale, we still refetch.
// exceptions are if one observer is disabled, then it gets bypassed.  also, if
// e.g. one of them has refetchOnWindowFocus: false , and you focus the window,
// we only look at the stale times of observers where this flag is true. "
const sharableQueryOptions = ['cacheTime', 'initialData', 'initialDataUpdatedAt', 'staleTime'];
const useOkapiQueryConfig = (path, { kyOpt = {}, searchParams = {}, ns = false, ...opt } = {}, keys = []) => {
  const okapiKy = useOkapiKy().extend(kyOpt);
  // const [namespace] = useNamespace();

  const extraOpt = {};
  if (opt.staleTime && !opt.cacheTime) {
    extraOpt.cacheTime = opt.staleTime + 5 * 60 * 1000;
  }

  const extraKeys = [];
  if (Object.keys(searchParams).length > 0) extraKeys.push(searchParams);
  const unshareable = omit(opt, sharableQueryOptions);
  if (Object.keys(unshareable).length > 0) extraKeys.push(unshareable);
  // if (ns) extraKeys.push(namespace);

  return {
    queryKey: [path, searchParams, ...extraKeys, ...keys],
    queryFn: () => okapiKy(path, { searchParams }).json(),
    // reinstating default currently disabled by stripes-core
    refetchOnWindowFocus: true,
    useErrorBoundary: true,
    ...extraOpt,
    ...opt,
  };
};

const useOkapiQuery = (...params) => useQuery(useOkapiQueryConfig(...params));

export { useOkapiQuery, useOkapiQueryConfig };
