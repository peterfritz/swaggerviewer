import {
  ActionIcon,
  Alert,
  Button, Center,
  Code,
  CopyButton,
  Group,
  Modal,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import Link from 'next/link';
import { useState } from 'react';
import { FaCheck, FaCopy, FaExclamationCircle } from 'react-icons/fa';
import { z } from 'zod';
import getRawUrl from '../utils/getRawUrl';

const schema = z.object({
  url: z.string().url('Must be a valid URL'),
});

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    title?: string,
    description?: string,
    version?: string,
    viewerUrl?: string,
    supported?: boolean,
  }>({});

  const form = useForm({
    initialValues: {
      url: '',
    },
    validateInputOnBlur: true,
    validate: zodResolver(schema),
    transformValues: (values) => ({
      ...values,
      url: getRawUrl(values.url),
    }),
  });

  const handleSubmit = async (values: typeof form['values']) => {
    setLoading(true);

    try {
      const specData = await fetch(
        `/api/spec/data?url=${encodeURIComponent(values.url)}`,
      ).then((res) => (res.json()));

      setData(specData);
    } catch (err) {
      console.log(err);

      form.setErrors({
        url: 'No data found',
      });

      setData({});
    }

    setLoading(false);
  };

  return (
    <Center
      sx={(theme) => ({
        padding: theme.spacing.sm,
        height: '100%',
        width: '100%',
      })}
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ display: 'contents' }}
      >
        <Stack w="100%" maw="30rem">
          <TextInput
            label="Your OpenAPI/Swagger file's URL"
            description="Accepts JSON and YAML"
            placeholder="https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore-expanded.yaml"
            type="url"
            {...form.getInputProps('url')}
          />
          <Button type="submit" loading={loading}>
            Fetch data
          </Button>
          <Modal
            centered
            opened={!!data.viewerUrl}
            onClose={() => setData({})}
            withCloseButton
            title={(
              data.title || data.version) && (
                <Group>
                  {data.title && (
                    <Title order={6}>{data.title}</Title>
                  )}
                  {data.version && (
                    <Code>
                      {`version ${data.version}`}
                    </Code>
                  )}
                </Group>
            )}
          >
            <Stack>
              {data.description && (
                <Spoiler
                  maxHeight={50}
                  showLabel="Show more"
                  hideLabel="Hide"
                >
                  <Text>{data.description}</Text>
                </Spoiler>
              )}
              {data.supported ? (
                <>
                  <TextInput
                    label="Swagger Viewer link"
                    value={data.viewerUrl}
                    mt={-10}
                    mb={10}
                    readOnly
                    rightSection={(
                      <CopyButton value={data.viewerUrl as string}>
                        {({ copied, copy }) => (
                          <ActionIcon
                            variant="default"
                            onClick={copy}
                          >
                            {copied ? <FaCheck /> : <FaCopy />}
                          </ActionIcon>
                        )}
                      </CopyButton>
                    )}
                  />
                  <Link
                    href={data.viewerUrl as string}
                    passHref
                    style={{
                      display: 'contents',
                    }}
                  >
                    <Button component="a">
                      Open on Swagger Viewer
                    </Button>
                  </Link>
                </>
              ) : (
                <Alert
                  icon={<FaExclamationCircle />}
                  title="Unsupported OpenAPI version"
                  color="red"
                  variant="outline"
                >
                  Sorry, SwaggerUI doesn&apos;t currently
                  support your OpenAPI specification version.
                </Alert>
              )}
            </Stack>
          </Modal>
        </Stack>
      </form>
    </Center>
  );
};

export default Home;
