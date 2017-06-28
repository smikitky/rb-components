# React-Bootstrap Components

Project-agnostic component sets used with react-bootstrap.

# Usage

Package consumers should directly `require` or `import` components
in the `lib` directory.

```js
import IconButton from '@smikitky/rb-components/lib/IconButton';
```

These are written in ES2015 with `object-rest-spread`,
so you'll need to transpile them using Babel or TypeScript set up for your project.
Scripts in `node_modules` are often configured to be ignored, so you may have to
specify that scripts under `@smikitky/rb-components` should be transpiled.

```js
loaders: [{
  test: t => (/\.jsx?/.test(t) && (/rb-components/.test(t) || !/node_modules/.test(t))),
  loader: 'babel-loader',
  query: {
    presets: ['es2015', 'react'],
    plugins: ['transform-object-rest-spread']
  }
}],
resolve: {
  modules: ['front-ui'],
  alias: { rb: '@smikitky/rb-components/lib' },
}
```

Polyfill scripts (like Promises) are not included.

# Requirements

The followings should be manually enabled in your project:

- Font Awesome (CSS, optional)
- Bootstrap (CSS Only)

These packages are marked as `dependencies`. These will not be included
in your final bundle unless you actually use the relevant components.

- `classnames`
- `moment`
- `tinycolor2`

# Demo

A small demo app is available via webpack-dev-server.

```
npm start
```

# Note

This package is basically intended for internal use only.

# License

MIT
