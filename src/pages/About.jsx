import NextPage from '../components/NextPage';
import PageHeader from '../components/PageHeader';
import Process from '../components/Process';
import Profile from '../components/Profile';
import { pageFor } from '../data/content';

export default function About() {
  return (
    <>
      <PageHeader page={pageFor('/about')} />
      <Profile />
      <Process />
      <NextPage current="/about" />
    </>
  );
}
