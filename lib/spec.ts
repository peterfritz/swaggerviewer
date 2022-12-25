import got from 'got';
import yaml from 'js-yaml';
import isJsonString from '../utils/isJsonString';

interface OpenAPISpec {
  openapi?: string,
  swagger?: string,
  info: {
    title: string,
    version: string,
    description?: string,
  }
}

const fetchSpec = async (url: string): Promise<OpenAPISpec> => {
  const { body } = await got(url);

  if (isJsonString(body)) {
    return JSON.parse(body);
  }

  const yamlSpec = yaml.load(body);

  if (!yamlSpec || typeof yamlSpec !== 'object') {
    throw new Error();
  }

  return yamlSpec as OpenAPISpec;
};

export default fetchSpec;
