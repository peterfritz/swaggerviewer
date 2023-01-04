import { Center } from '@mantine/core';
import CreditsAffix from '../components/CreditsAffix';
import SpecForm from '../components/SpecForm';

const Home = () => (
  <Center
    sx={{
      padding: 20,
      height: '100%',
      width: '100%',
    }}
  >
    <SpecForm />
    <CreditsAffix />
  </Center>
);

export default Home;
