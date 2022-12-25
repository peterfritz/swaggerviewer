import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import fetchSpec from '../../../lib/spec';

const SUPPORTED_VERSIONS = [
  '2.0',
  '3.0.0',
  '3.0.1',
  '3.0.2',
  '3.0.3',
];

type Data = {
  title: string,
  description: string,
  version: string,
  viewerUrl: string,
  supported: boolean
} | string

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) => {
  try {
    const url = z.string().url().parse(req.query.url);

    const spec = await fetchSpec(url);

    const viewerUrl = new URL(`${
      process.env.NODE_ENV === 'development' ? 'http' : 'https'
    }://${
      req.headers.host
    }`);

    viewerUrl.pathname = `/spec/${encodeURIComponent(Buffer.from(url).toString('base64'))}`;

    res.status(200).json({
      title: spec.info.title || '',
      description: spec.info.description || '',
      version: spec.info.version || '',
      viewerUrl: viewerUrl.href,
      supported: !spec.openapi || SUPPORTED_VERSIONS.includes(spec.openapi),
    });
  } catch (err) {
    console.log(err);

    res.status(400).send('No data found');
  }
};

export default handler;
