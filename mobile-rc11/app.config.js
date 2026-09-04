module.exports = {
  expo: {
    name: 'Movvant Enterprise',
    slug: 'movvant-enterprise',
    owner: 'movant',
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
      mapsConfiguredFromEnv: Boolean(process.env.GOOGLE_MAPS_API_KEY),
      eas: {
        projectId: '445d022e-f19a-44cd-bb5f-826d603bb70f'
      }
    }
  }
};
