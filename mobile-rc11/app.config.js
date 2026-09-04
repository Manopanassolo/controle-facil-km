const base = require('./app.json').expo;

module.exports = {
  expo: {
    ...base,
    plugins: [
      ['expo-location', {
        locationWhenInUsePermission: 'Permitir que o Movvant use sua localização durante os deslocamentos.'
      }]
    ],
    android: {
      ...base.android,
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
        }
      }
    },
    extra: {
      ...base.extra,
      mapsConfiguredFromEnv: Boolean(process.env.GOOGLE_MAPS_API_KEY)
    }
  }
};
