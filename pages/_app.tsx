import {
  Affix,
  Button,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  MantineProvider,
  Text,
  Tooltip,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { JetBrains_Mono as JetBrainsMono } from '@next/font/google';
import { getCookie, setCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import RouterTransition from '../components/RouterTransition';

import '../styles/globals.css';
import '../styles/swagger-ui.css';

const jetBrainsMono = JetBrainsMono({
  subsets: ['latin'],
  display: 'block',
});

const App = (props: AppProps & { theme: ColorScheme | 'system' }) => {
  const { Component, pageProps, theme } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(theme === 'system' ? 'dark' : theme);
  const systemTheme = useColorScheme();

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');

    setColorScheme(newColorScheme);

    setCookie('theme', newColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  useEffect(() => {
    if (theme === 'system') {
      toggleColorScheme(systemTheme);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, systemTheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
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
        <main
          className={colorScheme}
          style={{
            display: 'contents',
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
            <Group spacing="xs">
              <Tooltip.Floating label="Swagger, but classier">
                <Button
                  variant="default"
                  component={Link}
                  href="/"
                  leftIcon={(
                    <div
                      style={{
                        width: '1.75rem',
                      }}
                    >
                      <Image
                        src="/sunglasses.svg"
                        alt="Sunglasses emoji"
                        width={500}
                        height={200}
                        draggable={false}
                      />
                    </div>
                  )}
                >
                  <Text>
                    Swagger Viewer
                  </Text>
                </Button>
              </Tooltip.Floating>
              <Button
                variant="default"
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === 'dark' ? <FaMoon /> : <FaSun />}
              </Button>
            </Group>
          </Affix>
          <Component {...pageProps} />
        </main>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

App.getInitialProps = ({ ctx: context }: {ctx: GetServerSidePropsContext}) => ({
  theme: getCookie('theme', context) || 'system',
});

export default App;
