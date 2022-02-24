import { useHistory, useLocation } from 'react-router-dom';
import upNLevels from '../upNLevels';


export default (fallback) => {
  const history = useHistory();
  const location = useLocation();
  let dest = fallback;
  if (!dest) dest = upNLevels(location, 1);
  return () => {
    if (location?.state?.direct === true) history.goBack();
    else {
      history.push(dest);
    }
  };
};
