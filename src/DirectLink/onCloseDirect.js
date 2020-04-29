export default (fallback, history, location) => () => {
  if (location?.state?.direct === true) history.goBack();
  else history.push(fallback);
};

