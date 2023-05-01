import {
  Affix, Button, CopyButton, Loader,
} from '@mantine/core';
import {
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { FaCheck, FaCopy } from 'react-icons/fa';
import fetchSpec from '../../lib/spec';
import truncateText from '../../utils/text';

import 'swagger-ui-react/swagger-ui.css';

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

export const getStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<Data> = async (context) => {
  try {
    const url = Buffer.from(context.params?.url as string, 'base64').toString('utf-8');

    const spec = await fetchSpec(url);

    // context.res.setHeader(
    //   'Cache-Control',
    //   `public, s-maxage=${24 * 60 * 60}, stale-while-revalidate=${365 * 24 * 60 * 60}`,
    // );

    return {
      props: {
        spec,
        url: context.params?.url as string,
      },
      revalidate: 60 * 60 * 2, // 2 hours
    };
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);

    return {
      notFound: true,
    };
  }
};

const Spec = ({ spec, url }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <div
    style={{
      padding: '2.5rem 0',
    }}
  >
    <NextSeo
      title={spec.info.title ? truncateText(spec.info.title, 42) : undefined}
      description={spec.info.description ? truncateText(spec.info.description, 150) : undefined}
      canonical={`https://swaggerviewer.ptr.red/spec/${encodeURIComponent(url)}`}
      openGraph={{
        url: `https://swaggerviewer.ptr.red/spec/${encodeURIComponent(url)}`,
        siteName: 'Swagger Viewer',
        title: spec.info.title ? truncateText(spec.info.title, 42) : undefined,
        description: spec.info.description ? truncateText(spec.info.description, 150) : undefined,
        images: [
          {
            url: `https://swaggerviewer.ptr.red/api/og?t=${
              encodeURIComponent(
                spec.info.title ? truncateText(spec.info.title, 20) : 0,
              )
            }&v=${
              encodeURIComponent(
                spec.info.version || 0,
              )
            }&d=${
              encodeURIComponent(
                spec.info.description ? truncateText(spec.info.description, 160) : 0,
              )
            }`,
            width: 1200,
            height: 630,
            alt: spec.info.title,
            type: 'image/png',
          },
        ],
      }}
    />
    <Affix
      position={{
        top: 20,
        right: 20,
      }}
    >
      <CopyButton value={`https://swaggerviewer.ptr.red/spec/${encodeURIComponent(url)}`}>
        {({ copied, copy }) => (
          <Button
            variant="default"
            onClick={copy}
            leftIcon={
              copied ? <FaCheck /> : <FaCopy />
            }
          >
            {copied ? 'Copied link' : 'Copy link'}
          </Button>
        )}
      </CopyButton>
    </Affix>
    <SwaggerUI
      spec={spec}
    />
  </div>
);

export default Spec;
