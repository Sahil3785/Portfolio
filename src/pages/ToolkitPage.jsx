import NextPage from '../components/NextPage';
import PageHeader from '../components/PageHeader';
import Stream from '../components/Stream';
import Toolkit from '../components/Toolkit';
import { pageFor } from '../data/content';

export default function ToolkitPage() {
  return (
    <>
      <PageHeader page={pageFor('/skills')} />
      <Stream />
      <Toolkit />
      <NextPage current="/skills" />
    </>
  );
}
