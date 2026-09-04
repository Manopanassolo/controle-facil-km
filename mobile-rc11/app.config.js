module.exports = {
  expo: {
    name: 'Movvant Enterprise',
    slug: 'movvant-mobile-rc11',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    plugins: [
      ['expo-location', {
        locationWhenInUsePermission: 'Permita que o Movvant use sua localização para registrar deslocamentos e rotas.'
      }]
    ],
    android: {
      package: 'com.movvant.enterprise',
      versionCode: 23,
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
        }
      }
    },
    extra: {
      releaseChannel: 'rc11',
      mapsConfiguredFromEnv: Boolean(process.env.GOOGLE_MAPS_API_KEY)
    }
  }
};
