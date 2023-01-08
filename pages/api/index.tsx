import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const getSatoshi = fetch(
  new URL('../../assets/Satoshi.ttf', import.meta.url)
).then((res) => res.arrayBuffer());
const getClashDisplay = fetch(
  new URL('../../assets/ClashDisplay.ttf', import.meta.url)
).then((res) => res.arrayBuffer());
const getAloeVera = fetch(
  new URL('../../assets/AloeVera.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const DEFAULT_TITLE = 'Niouz';
  const DEFAULT_DESCRIPTION =
    'Democratizing news for all Haitians';
  const LOGO = 'https://legacy.niouz.app/favicon/niouz.png';
  const DEFAULT_AUTHOR = 'niouz.app';
  const DEFAULT_THEME = 'rose';

  const [satoshi, clashDisplay, aloeVera] = await Promise.all([
    getSatoshi,
    getClashDisplay,
    getAloeVera,
  ]);

  const { searchParams } = req.nextUrl;
  const get = (key: string, fallback: string | null = null): string | null => {
    if (!searchParams.has(key)) return fallback;
    return searchParams.get(key)!!.replaceAll('+', ' ');
  } 


  // get content from query params
  const title = get('title', DEFAULT_TITLE)
  const description = get('description', DEFAULT_DESCRIPTION)
  const avatar = get('avatar', '🇭🇹')
  const author = get('author', DEFAULT_AUTHOR)
  const theme = get('theme', DEFAULT_THEME)
  const logo = get('logo', LOGO)

  console.log({ title, description, avatar, author, logo })

  return new ImageResponse(
    (
      <div
        tw={`h-full w-full px-20 py-16 bg-${theme}-700 flex flex-col justify-between`}
      >
        <h1 tw={`text-8xl text-${theme}-100 leading-none`} style={{ fontFamily: 'ClashDisplay' }}>
          {title}
        </h1>
        <p
          tw={`mb-16 text-5xl text-${theme}-300 leading-tight`}
          style={{ fontFamily: 'Satoshi' }}
        >
          {description}
        </p>
        <div tw="w-full flex flex-row items-center">
          {avatar?.startsWith('http') ? (
            <img
              src={avatar}
              tw={`mr-4 h-14 w-14 bg-${theme}-300 rounded-full`}
            />
          ) : (
            <span tw="mr-4 text-5xl">{avatar}</span>
          )}
          <span
            tw={`text-5xl text-${theme}-200 mr-auto`}
            style={{ fontFamily: 'AloeVera' }}
          >
            {author}
          </span>
          {logo?.startsWith('http') ? (
            <img src={logo} tw="h-14 w-14 rounded-full" />
          ) : (
            <span tw={`text-5xl text-${theme}-200`}>{logo}</span>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Satoshi',
          data: satoshi,
        },
        {
          name: 'ClashDisplay',
          data: clashDisplay,
        },
        {
          name: 'AloeVera',
          data: aloeVera,
        },
      ],
    }
  );
}
