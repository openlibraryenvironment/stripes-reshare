import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DirectLink = ({ children, component, to, ...rest }) => {
  const Component = component || Link;
  return (
    <Component
      to={typeof to === 'object'
        ? {
          ...to,
          state: {
            ...to?.state,
            direct: true
          }
        }
        : {
          pathname: to,
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
  component: PropTypes.element.isRequired,
  to: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]).isRequired,
  children: PropTypes.node.isRequired,
};

export default DirectLink;
