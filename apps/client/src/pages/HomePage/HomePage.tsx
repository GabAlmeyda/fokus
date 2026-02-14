import { useEffect, type JSX } from 'react';
import PageView from '../../components/layouts/PageView/PageView';
import Main from '../../components/layouts/Main/Main';
import MenuBar from '../../components/ui/HomePage/MenuBar/MenuBar';

export default function HomePage(): JSX.Element {
  // Changes the page title
  useEffect(() => {
    document.title = 'Fokus - Início';
  }, []);

  return (
    <PageView>
      <Main>
        <MenuBar />
      </Main>
    </PageView>
  );
}
