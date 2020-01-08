console.log('@ this is a service working running')

/*
  Caching Data
    - GraphQL needs a bit of tweaking to get it working since POST request aren't exactly cached and it is only a single point entry. See reference [1]for implementation

  [1] - https://medium.com/@jono/cache-graphql-post-requests-with-service-worker-100a822a388a
*/

// Init indexedDB using idb-keyval, https://github.com/jakearchibald/idb-keyval

workbox.precaching.precacheAndRoute(self.__precacheManifest)
