import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Col, RadioButton, Row } from '@folio/stripes/components';

const RefdataButtons = (props) => {
  // Render the right number of buttons:
  const { labelTranslations, lockColumns, maxCols = 4 } = props;
  const intl = useIntl();

  // maxCols can be any of 1,2,3 or 4. Anything outside of this should be disregarded and default to 4.
  const maximumColumns = [1, 2, 3, 4].includes(maxCols) ? maxCols : 4;

  const buttonRender = (dataOptions, dynamicColumnWidth) => {
    // This accepts a SORTED list of dataoptions.
    const { input } = props;
    const numberOfButtons = dataOptions.length;
    return (
      dataOptions.map(option => {
        const buttonProps = {
          'checked': input.value === option.value,
          'fullWidth': true,
          'label': (labelTranslations ? intl.formatMessage({ id: `${labelTranslations.key}.${option.value}`, defaultMessage: option.label }) : option.label),
          'marginBottom0': true,
          'onChange': (() => input.onChange(option.value)),
          'value': option.value
        };

        return (
          <Col xs={dynamicColumnWidth ? (12 / numberOfButtons) : (12 / maximumColumns)} key={`${input.name}:${option.id}`}>
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
    if (!lockColumns && arrayLength <= maximumColumns) {
      return (
        <Row>
          {buttonRender(sortedDataOptions, true)}
        </Row>
      );
    }

    const rowsNeeded = Math.ceil(sortedDataOptions.length / maximumColumns);
    const chunkedDataOptions = [];

    for (let i = 0; i < rowsNeeded; i++) {
      chunkedDataOptions.push(sortedDataOptions.slice((i * maximumColumns), (i * maximumColumns + maximumColumns)));
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
