// Takes the refdata as it comes from the endpoint and teases out a sorted
// array of objects to feed to a select control eg. the value property is set
// to the id.
const selectifyAndTranslateRefdata = (refdataRecords, translationPrefix, intl) => (
  refdataRecords
    ?.map(obj => (
      obj.values.map(entry => ({
        label: intl.formatMessage({ id: `${translationPrefix}.${entry.value}` }),
        value: entry.id
      }))
    ))[0]
    ?.sort((a, b) => a.label?.localeCompare(b.label))
);

export default selectifyAndTranslateRefdata;
