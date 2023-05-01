import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const font = fetch(new URL('../../assets/JetBrainsMono-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

const handler = async (req: NextRequest) => {
  const fontData = await font;

  const { searchParams } = new URL(req.url);

  const t = searchParams.get('t');
  const v = searchParams.get('v');
  const d = searchParams.get('d');

  const title = t && t !== '0' ? t : null;
  const version = v && v !== '0' ? v : null;
  const description = d && d !== '0' ? d : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1b1e',
          color: '#b5bac9',
          fontSize: 65,
          fontWeight: 900,
        }}
      >
        <div
          style={{
            width: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          <p
            style={{
              width: '100%',
              textAlign: 'right',
              margin: 0,
              marginLeft: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </p>
          {version && (
            <p
              style={{
                margin: 0,
                marginLeft: 60,
                fontWeight: 200,
                fontSize: 65,
              }}
            >
              v
              {version}
            </p>
          )}
        </div>
        {description && (
          <div
            style={{
              width: '80%',
              marginTop: 40,
              fontWeight: 400,
              fontSize: 45,
              maxHeight: '47%',
              overflow: 'hidden',
            }}
          >
            {description}
          </div>
        )}
      </div>

    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
        },
      ],
      headers: {
        'Cache-Control': `public, s-maxage=${60 * 60 * 2}, stale-while-revalidate=${60 * 60 * 24 * 365}}`,
      },
    },
  );
};

export default handler;
