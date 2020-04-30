# DirectLink

`DirectLink` is a component that passes through its props to react-router's
`Link` but in the process will rewrite the `to` prop as an object and add a
boolean `state: true` property. This allow the linked route to determine if the
user has arrived there directly via an explicit in-app link vs. other
navigation such as switching between apps or directly entering the URL. An
optional `component` prop can be provided for another component to receive
the rewritten `to`, `Button` for example.


## onCloseDirect

`onCloseDirect(fallback, history, location)` returns a function that uses
react-router's location object to deteremine if a DirectLink was used and it's
safe to just go back to the previous URL as it was where the user clicked a
link to get here or they have since gone to some other app and need to to go
back to the path specified in the fallback arg.

TODO: currently this needs to also be passed the react-router history
and location as additional parameters because FOLIO is currently not
on a recent enough version of react-router to leverage `useRouter` and
implement this as a hook.

