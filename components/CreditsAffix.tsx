import {
  Affix,
  Anchor,
  Button,
  Group,
  HoverCard,
  Stack,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { SiGithub, SiVercel } from 'react-icons/si';

const CreditsAffix = () => (
  <Affix
    position={{
      bottom: 20,
      right: 20,
    }}
  >
    <Group
      spacing={0}
    >
      <HoverCard>
        <HoverCard.Target>
          <Button
            variant="default"
            component={Link}
            href="https://ptr.red/"
            target="_blank"
            styles={(theme) => ({
              root: {
                borderRadius: `${theme.radius.sm}px 0 0 ${theme.radius.sm}px`,
                marginRight: '-1px',
              },
            })}
          >
            <Text>
              By ptr
            </Text>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown
          style={{
            transform: 'translate(-20px)',
          }}
        >
          <Stack
            maw="min(calc(100vw - 74px), 25rem)"
          >
            <Text size="sm">
              Made with
              {' '}
              <Anchor
                component={Link}
                href="https://nextjs.org/"
                target="_blank"
              >
                Next.js
              </Anchor>
              {', '}
              <Anchor
                component={Link}
                href="https://www.npmjs.com/package/swagger-ui-react"
                target="_blank"
              >
                Swagger UI
              </Anchor>
              {', '}
              and
              {' '}
              <Anchor
                component={Link}
                href="https://github.com/Amoenus/SwaggerDark"
                target="_blank"
              >
                Amoenus Swagger Dark Theme
              </Anchor>
              .
            </Text>
            <Text size="sm">
              Inspired on
              {' '}
              <Anchor
                component={Link}
                href="https://swagger-viewer.vercel.app/"
                target="_blank"
              >
                Swagger Viewer
              </Anchor>
              {' '}
              by
              {' '}
              <Anchor
                component={Link}
                href="https://github.com/haishanh"
                target="_blank"
              >
                @haishan
              </Anchor>
              .
            </Text>
            <Button
              variant="outline"
              component={Link}
              href="/deploy"
              target="_blank"
              leftIcon={
                <SiVercel />
                  }
            >
              Deploy with Vercel
            </Button>
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
      <Button
        variant="default"
        component={Link}
        href="https://github.com/peterfritz/swaggerviewer"
        target="_blank"
        leftIcon={
          <SiGithub />
            }
        styles={(theme) => ({
          root: {
            borderRadius: `0 ${theme.radius.sm}px ${theme.radius.sm}px 0`,
          },
        })}
      >
        GitHub
      </Button>
    </Group>
  </Affix>
);

export default CreditsAffix;
