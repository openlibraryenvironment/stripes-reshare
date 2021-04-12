# Refdata Buttons

A react-final-form Field component to render radio buttons for each of a selection of refdata values.

## Basic Usage

```
import { Field } from  'react-final-form';
import { RefdataButtons} from '@reshare/stripes-reshare';

...
<Field
  name={`${this.props.input.name}`}
  component={RefdataButtons}
  dataOptions={[
    { id:  '1', label:  'label 1', value:  'value 1' },
    { id:  '2', label:  'label 2', value:  'value 2' },
    { id:  '3', label:  'label 3', value:  'value 3' }
  ]}
/>
   
```

## Props
Name | Type | Description
--- | --- | ---
dataOptions| array| Array of refdata options to render buttons for|
labelTranslations| object| Translations for the displayed refdata values|
lockColumns| bool| Locks the column widths to match the maxCols prop|
maxCols| int <= 4| The maximum number of columns you want the component to render, from 1 to 4|
|
### dataOptions
Takes an array of objects of the form:
```
{
  id:  '123',
  label:  'label',
  value:  'value'
}
```
These options will be rendered dynamically in rows depending on the maxCol prop.

### labelTranslations
Takes an object of the form 
```
{ key:  'ui-rs.settings.customiseListSelect.loanConditions'}
```
This will be used to translate each value in the dataOptions, using the concatenation:
```
${labelTranslations.key}.${dataOption.value}
```
In future this object may be expanded to hold more complicated logic.

### lockColumns
If this prop is set to false, then for any amount of options fewer than `maxCols`, it will render the options in the correct number of columns, with wider widths. If set to true, it will render them in `maxCols` columns instead.

For example, if the `maxCols` prop is set to 3, and 2 options are provided, then if `lockColumns == true`, three columns would be rendered (each taking up 33.3% of the available width), with the first 2 populated with the options provided.
If `lockColumns == false`, then only two columns would be rendered, each taking up half of the available width.

### maxCols
An integer, 1,2,3 or 4, which determines how many columns the options are allowed to fill.
If handed anything outside of the options listed above this will default to 4.
