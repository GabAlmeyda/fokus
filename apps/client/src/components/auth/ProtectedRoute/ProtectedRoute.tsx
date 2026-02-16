import { useEffect, type JSX } from 'react';
import { APP_URLS } from '../../../helpers/app.helpers';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserQueries } from '../../../helpers/hooks/user-user.hook';

export default function ProtectedRoute(): JSX.Element {
  const navigate = useNavigate();
  const { data, isFetched, isLoading } = useUserQueries().meQuery;

  useEffect(() => {
    if (isFetched && !data) navigate(APP_URLS.login);
  }, [data, isFetched]);

  if (isLoading || !data) return <div></div>;

  return <Outlet />;
}
