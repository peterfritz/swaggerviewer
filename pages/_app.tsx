import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { AppProps } from 'next/app';

import { DefaultSeo } from 'next-seo';
import '../styles/globals.css';
import '../styles/swagger-ui.css';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const colorScheme = useColorScheme('dark');

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        primaryColor: 'teal',
      }}
    >
      <DefaultSeo
        title="Swagger Viewer"
        titleTemplate="%s | Swagger Viewer"
        openGraph={{
          type: 'website',
          locale: 'en',
          url: 'https://swaggerviewer.ptr.red/',
          siteName: 'Swagger Viewer',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
