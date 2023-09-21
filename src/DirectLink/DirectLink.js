import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const DirectLink = ({ children, component, to, preserveSearch, ...rest }) => {
  const location = useLocation();
  const Component = component || Link;
  const preservedSearch = preserveSearch ? { search: location.search } : {};
  return (
    <Component
      to={typeof to === 'object'
        ? {
          ...to,
          ...preservedSearch,
          state: {
            ...to?.state,
            direct: true
          }
        }
        : {
          pathname: to,
          ...preservedSearch,
          state: {
            direct: true
          }
        }
      }
      {...rest}
    >
      {children}
    </Component>
  );
};

DirectLink.propTypes = {
  component: PropTypes.elementType,
  to: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]).isRequired,
  children: PropTypes.node.isRequired,
  preserveSearch: PropTypes.bool,
};

export default DirectLink;
