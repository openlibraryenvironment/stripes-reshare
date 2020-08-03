import React from 'react';
import PropTypes from 'prop-types';
import { Col, RadioButton, Row } from '@folio/stripes/components';

const RefdataButtons = (props) => {
  // Render the right number of buttons:

  const buttonRender = (dataOptions, dynamicColumnWidth) => {
    // This accepts a SORTED list of dataoptions.
    const { input } = props;
    const numberOfButtons = dataOptions.length;
    return (
      dataOptions.map(option => {
        const buttonProps = {
          'checked': input.value === option.value,
          'fullWidth': true,
          'label': option.label,
          'marginBottom0': true,
          'onChange': (() => input.onChange(option.value)),
          'value': option.value
        };

        return (
          <Col xs={dynamicColumnWidth ? (12 / numberOfButtons) : 3} key={`${input.name}:${option.id}`}>
            <RadioButton
              {...buttonProps}
            />
          </Col>
        );
      })
    );
  };

  const returnRows = (dataOptions) => {
    const sortedDataOptions = dataOptions.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    const arrayLength = sortedDataOptions.length;
    if (arrayLength <= 4) {
      return (
        <Row>
          {buttonRender(sortedDataOptions, true)}
        </Row>
      );
    }

    const rowsNeeded = Math.ceil(sortedDataOptions.length / 4);
    const chunkedDataOptions = [];

    for (let i = 0; i < rowsNeeded; i++) {
      chunkedDataOptions.push(sortedDataOptions.slice((i * 4), (i * 4 + 4)));
    }
    return (
      chunkedDataOptions.map((cdo, index) => {
        return (
          <Row
            key={`${props.input.name}:row${index}`}
          >
            {buttonRender(cdo, false)}
          </Row>
        );
      })
    );
  };

  return (
    returnRows(props.dataOptions)
  );
};

RefdataButtons.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default RefdataButtons;
