import {
  ActionIcon,
  Alert,
  Button,
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
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaCopy, FaExclamationCircle } from 'react-icons/fa';
import { z } from 'zod';
import getRawUrl from '../utils/getRawUrl';

const schema = z.object({
  url: z.string().url('Must be a valid URL'),
});

const SpecForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    title?: string,
    description?: string,
    version?: string,
    viewerUrl?: string,
    supported?: boolean,
  }>({});

  const router = useRouter();
  const urlInput = useRef<HTMLInputElement>(null);
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
      const specData: typeof data = await fetch(
        `/api/spec/data?url=${encodeURIComponent(values.url)}`,
      ).then((res) => (res.json()));

      setData(specData);

      const url = new URL(specData.viewerUrl as string);

      router.prefetch(url.pathname);
    } catch (err) {
      form.setErrors({
        url: 'No spec file found',
      });

      setData({});
    }

    setLoading(false);
  };

  useEffect(() => {
    if (urlInput.current) {
      urlInput.current.focus();
    }
  }, []);

  return (
    <Stack
      w="100%"
      maw="30rem"
      align="stretch"
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ display: 'contents' }}
      >
        <TextInput
          label="Your OpenAPI/Swagger file's URL"
          description="Accepts JSON and YAML"
          placeholder="https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore-expanded.yaml"
          type="url"
          ref={urlInput}
          autoFocus
          {...form.getInputProps('url')}
        />
        <Button type="submit" loading={loading}>
          Fetch data
        </Button>
      </form>
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
              <Button
                component={Link}
                href={data.viewerUrl as string}
              >
                Open on Swagger Viewer
              </Button>
            </>
          ) : (
            <Alert
              icon={<FaExclamationCircle />}
              title="Unsupported OpenAPI version"
              color="red"
              variant="outline"
            >
              Sorry, Swagger UI doesn&apos;t currently
              support your OpenAPI specification version.
            </Alert>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
};

export default SpecForm;
