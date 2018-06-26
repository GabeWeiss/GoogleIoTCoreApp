// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: 'AIzaSyClOMzTiUFmfCNt4Uevwj4jZb0YLnfZsSU',
  authDomain: 'iotcoreappnext2018pre-2f91e.firebaseapp.com',
  databaseURL: 'https://iotcoreappnext2018pre-2f91e.firebaseio.com',
  projectId: 'iotcoreappnext2018pre-2f91e',
  storageBucket: 'iotcoreappnext2018pre-2f91e.appspot.com',
  messagingSenderId: '443490724972'
};

export const environment = {
  production: false,
  firebase: firebaseConfig
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
