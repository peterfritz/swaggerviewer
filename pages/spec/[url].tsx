import { Loader } from '@mantine/core';
import { JetBrains_Mono as JetBrainsMono } from '@next/font/google';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import fetchSpec from '../../lib/spec';

/* eslint-disable-next-line */
const jetBrainsMono = JetBrainsMono({ subsets: ['latin'] });

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  loading: () => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader />
    </div>
  ),
  ssr: false,
});

interface Data {
  spec: {
    info: {
      title: string,
      version: string,
      description?: string
    }
  },
  url: string
}

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  try {
    const url = Buffer.from(context.params?.url as string, 'base64').toString('utf-8');

    const spec = await fetchSpec(url);

    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=86400',
    );

    return {
      props: {
        spec,
        url: context.params?.url as string,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      notFound: true,
    };
  }
};

const Spec = ({ spec, url }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div
    className={jetBrainsMono.className}
    style={{
      fontFamily: `${jetBrainsMono.style.fontFamily} !important`,
      padding: '2.5rem 0',
    }}
  >
    <NextSeo
      title={spec.info.title}
      description={spec.info.description}
      canonical={`https://swaggerviewer.ptr.red/spec/${encodeURIComponent(url)}`}
      openGraph={{
        url: `https://swaggerviewer.ptr.red/spec/${encodeURIComponent(url)}`,
        siteName: 'Swagger Viewer',
        title: spec.info.title,
        description: spec.info.description,
        images: [
          {
            url: `https://swaggerviewer.ptr.red/api/og?t=${
              encodeURIComponent(spec.info.title || 0)
            }&v=${
              encodeURIComponent(spec.info.version || 0)
            }&d=${
              encodeURIComponent(spec.info.description || 0)
            }`,
            width: 1200,
            height: 630,
            alt: spec.info.title,
            type: 'image/png',
          },
        ],
      }}
    />
    <SwaggerUI
      spec={spec}
    />
  </div>
);

export default Spec;
