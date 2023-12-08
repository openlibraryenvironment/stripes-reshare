# stripes-reshare

This is a library of common elements used by Stripes apps for the ReShare ILL system.

## Release Procedure

To prepare for a release, create a release branch. We use the naming convention of release-vN.N.x, where N.N.x is major version, minor version, and the letter x for the patch version.  When ready to release, make sure the package.json version is set to the target release version. Use the following procedure to create a release.

1. Checkout the release branch, and tag the commit to be released (`git tag vN.N.x`).

1. Select "Draft a new release" from the GitHub release management page here: https://github.com/openlibraryenvironment/stripes-reshare/releases

1. Choose the appropriate tag, and write up the changes. When you publish the release CI will publish the package to the GitHub npm repository npm.pkg.github.com.
