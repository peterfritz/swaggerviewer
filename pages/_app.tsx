import {
  Affix,
  AspectRatio,
  Button,
  MantineProvider,
  Text,
  Tooltip,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { JetBrains_Mono as JetBrainsMono } from '@next/font/google';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Image from 'next/image';
import Link from 'next/link';

import RouterTransition from '../components/RouterTransition';
import '../styles/globals.css';
import '../styles/swagger-ui.css';

const jetBrainsMono = JetBrainsMono({
  subsets: ['latin'],
  display: 'block',
});

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
        fontFamily: jetBrainsMono.style.fontFamily,
        fontFamilyMonospace: jetBrainsMono.style.fontFamily,
        headings: {
          fontFamily: jetBrainsMono.style.fontFamily,
        },
      }}
    >
      <DefaultSeo
        defaultTitle="Swagger Viewer"
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
        additionalLinkTags={[
          {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/sunglasses.svg',
          },
        ]}
      />
      <RouterTransition />
      <Affix
        position={{
          top: 20,
          left: 20,
        }}
      >
        <Tooltip.Floating label="Swagger, but classier">
          <Button
            variant="default"
            component={Link}
            href="/"
            leftIcon={(
              <AspectRatio
                ratio={10 / 4}
                w="1.75rem"
                mr={5}
              >
                <Image
                  src="/sunglasses.svg"
                  alt="Sunglasses emoji"
                  width={500}
                  height={200}
                  draggable={false}
                />
              </AspectRatio>
            )}
          >
            <Text>
              Swagger Viewer
            </Text>
          </Button>
        </Tooltip.Floating>
      </Affix>
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
