/*
 * onCloseDirect() returns a function that takes a fallback URL and uses
 * react-router's location object to deteremine if a DirectLink was used
 * and it's safe to just go back to the previous URL as it was where the
 * user clicked a link to get here or they have since gone to some other
 * app and need to to go back to the path specified in the fallback arg.
 *
 * TODO: currently this needs to also be passed the react-router history
 * and location as additional parameters because FOLIO is currently not
 * on a recent enough version of react-router to leverage useRouter and
 * implement this as a hook.
 */

export default (fallback, history, location) => () => {
  if (location?.state?.direct === true) history.goBack();
  else history.push(fallback);
};
