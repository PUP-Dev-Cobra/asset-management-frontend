# React Sandbox v2

An updated version of the [react-sandbox](https://github.com/abarcenas29/react-sandbox) with updated technologies and React v16

```
This is client-centric version. For SSR [use this](https://github.com/abarcenas29/ssr-react-boilerplace) (Not Updated Anymore).
```

## Features

* PrettierJS
* React Router v4
* React v16.x
* Redux
* Redux-Observable
* Relay
* Styled Components
* Webpack 4

## Submodules

This project relies on other modules in order to run. I decided to decouple some of the elements since it can be used in other projects if needed.

* [Atomic-Styles](https://github.com/abarcenas29/atomic_classes) - For general styling and my built-in css classes for creating websites
* [Webpack Config](https://github.com/abarcenas29/sandbox-webpack) - Webpack configuration of the sandbox. It can also be used on other projects when needed.

## PWA

Progressive web app is now supported. At least when it comes to caching webpack generated files. Implementation of the caching in fetch will need to be done once decided on how the API call is made. That is either on the traditional REST or GraphQL.

### GraphQL vs REST PreCaching

Because GraphQL request are binded into only one api, the usual implementation of data caching is different. Thus, there is a sepcific `sw-src.graphql.js` implementation for graphQL backend.

[Reference Guide](https://developers.google.com/web/tools/workbox)

## How To Run

* run `npm install`
* copy the `.env.sample` to the root directory
* for development `npm run start:dev`
* for production `npm run build:prod`

