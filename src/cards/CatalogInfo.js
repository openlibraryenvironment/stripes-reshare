// http://shared-index.reshare-dev.indexdata.com/inventory/view/7c4420ad-a946-4099-b616-aff3e9f581e4
// http://ec2-34-229-181-20.compute-1.amazonaws.com:9130/inventory/instances/7c4420ad-a946-4099-b616-aff3e9f581e4

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import find from 'lodash/find';
import { withStripes } from '@folio/stripes/core';
import {
  Card,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import { isbnTypeId, issnTypeId } from '../inventoryTypeIds';

import css from './CatalogInfo.css';


function identifierValue(bibRecord, typeId) {
  const ids = bibRecord.identifiers || [];
  const entry = find(ids, (v) => v.identifierTypeId === typeId);
  return entry ? entry.value : undefined;
}


class CatalogInfo extends React.Component {
  static propTypes = {
    request: PropTypes.object,
    id: PropTypes.string,
    stripes: PropTypes.shape({
      config: PropTypes.shape({
        reshare: PropTypes.shape({
          sharedIndex: PropTypes.shape({
            ui: PropTypes.string.isRequired,
          }),
        }),
      }),
    }),
  };

  static defaultProps = {
    id: 'catalogInfo'
  };

  render() {
    const { request, stripes } = this.props;
    const id = request.systemInstanceIdentifier;
    const json = request.bibRecord;
    if (!json) {
      stripes.logger.log('bib', 'no bibRecord');
      return null;
    }

    let bibRecord;
    try {
      bibRecord = JSON.parse(json);
    } catch (e) {
      stripes.logger.log('bib', `could not parse bibRecord '${json}':`, e);
      return null;
    }

    stripes.logger.log('bib', 'bibRecord =', bibRecord);
    try {
      var title = bibRecord.title;
      var author = get(bibRecord, 'contributors[0].name');
      var date = get(bibRecord, 'publication[0].dateOfPublication');

      var isbn = identifierValue(bibRecord, isbnTypeId);
      var issn = identifierValue(bibRecord, issnTypeId);
      var hasISSN = !!issn;
      var idKey = `stripes-reshare.catalogInfo.${hasISSN ? 'issn' : 'isbn'}`;
      var idValue = hasISSN ? issn : isbn;

      var siUrl = stripes?.config?.reshare?.sharedIndex?.ui;
      var inventoryLink = siUrl ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${siUrl}/inventory/view/${id}`}
        >
          <FormattedMessage id="stripes-reshare.catalogInfo.viewRecord" />
        </a>
      ) : null;
    } catch (e) {
      return <FormattedMessage id="stripes-reshare.catalogInfo.error" />;
    }

    return (
      <Card
        id={`${this.props.id}-card`}
        headerStart="Catalog"
        headerEnd={inventoryLink}
        roundedBorder
        cardClass={css.catalogCard}
        headerClass={css.catalogCardHeader}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="stripes-reshare.catalogInfo.title" />}
              value={title}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="stripes-reshare.catalogInfo.author" />}
              value={author}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id={idKey} />}
              value={idValue}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="stripes-reshare.catalogInfo.date" />}
              value={date}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default withStripes(CatalogInfo);
