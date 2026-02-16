import { useEffect, type JSX } from 'react';
import { APP_URLS } from '../../../helpers/app.helpers';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserQueries } from '../../../helpers/hooks/user-user.hook';

export default function ProtectedRoute(): JSX.Element {
  const navigate = useNavigate();
  const { isLoading, isError } = useUserQueries().meQuery;

  useEffect(() => {
    if (isError) navigate(APP_URLS.login);
  }, [isError]);
  
  return isLoading ? <div></div> : <Outlet />;
}
