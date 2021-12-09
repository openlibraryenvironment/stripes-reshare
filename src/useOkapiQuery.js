import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
// TODO: ReShare is not using new enough Stripes for NS
// import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useOkapiQueryConfigNoNS = (path, searchParams, keys, { queryOpt = {}, kyOpt = false }) => {
  const okapiKy = useOkapiKy();
  const ky = kyOpt ? okapiKy.extend(kyOpt) : okapiKy;
  return {
    queryKey: [path, searchParams, ...keys],
    queryFn: () => ky(path, { searchParams }).json(),
    useErrorBoundary: true,
    ...queryOpt,
  };
};

// const useOkapiQueryConfig = (path, searchParams, keys, opt) => {
//   const [ns] = useNamespace();
//   return useOkapiQueryConfigNoNS(path, searchParams, [ns, ...keys], opt);
// };

// const useOkapiQuery = (...params) => useQuery(useOkapiQueryConfig(...params));

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
const useSharedOkapiQueryConfig = (path, searchParams, staleTime, opt) => useOkapiQueryConfigNoNS(
  path, searchParams, opt ? [opt] : [], {
    queryOpt: { staleTime, cacheTime: staleTime + 5 * 60 * 1000, ...(opt || {}) }
  }
);
const useSharedOkapiQuery = (...params) => useQuery(useSharedOkapiQueryConfig(...params));

// export { useOkapiQuery, useOkapiQueryConfig, useSharedOkapiQuery, useSharedOkapiQueryConfig };
export { useSharedOkapiQuery, useSharedOkapiQueryConfig };
