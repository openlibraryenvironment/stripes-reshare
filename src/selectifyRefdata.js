// Takes the refdata as it comes from the endpoint and teases out a sorted
// array of objects to feed to a select control eg. the value property is set
// to the id.
const selectifyRefdata = (refdataRecords) => (
  refdataRecords
    ?.map(obj => (
      obj.values.map(entry => ({ label: entry.label, value: entry.id }))
    ))[0]
    ?.sort((a, b) => a.label?.localeCompare(b.label))
);

export default selectifyRefdata;
