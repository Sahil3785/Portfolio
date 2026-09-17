import Experience from '../components/Experience';
import NextPage from '../components/NextPage';
import PageHeader from '../components/PageHeader';
import { pageFor } from '../data/content';

export default function ExperiencePage() {
  return (
    <>
      <PageHeader page={pageFor('/experience')} />
      <Experience />
      <NextPage current="/experience" />
    </>
  );
}
