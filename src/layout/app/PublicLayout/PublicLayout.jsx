import Header from '../../EventsHeader/EventsHeader';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
