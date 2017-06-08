# React-Bootstrap Components

Project-agnostic component sets used with react-bootstrap.

# Usage

Package consumers should directly `require` or `import` components
in the `lib` directory.

```
import IconButton from '@smikitky/rb-components/lib/IconButton';
```

These are written in ES2015 with `object-rest-spread`,
so you'll need to transpile them using Babel or TypeScript set up for your project.

Polyfills (like Promises) are not included.

# Requirement

The followings should be manually enabled in your project:

- Font Awesome (CSS)
- Bootstrap (CSS Only)

These pakages are marked as `dependencies`:

- `classnames`
- `moment`

# Note

This package is basically intended for internal use only.

# License

MIT
