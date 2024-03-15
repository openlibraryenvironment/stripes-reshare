// Takes the refdata as it comes from the endpoint and teases out an
// object to feed to a select control eg. the value property is set to the id.
const selectifyRefdata = (refdataRecords) => (
  refdataRecords
    .map(obj => (
      obj.values.map(entry => ({ label: entry.label, value: entry.id }))
    ))[0]
);

export default selectifyRefdata;