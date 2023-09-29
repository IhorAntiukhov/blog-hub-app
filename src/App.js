import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from './store';
import HomePage from './pages/HomePage';
import UserInfoPage from './pages/UserInfoPage';
import UserProfilePage from './pages/UserProfilePage';
import Sidebar from './components/navigation/Sidebar';
import Route from './components/navigation/Route';
import NotificationBar from './components/notifications/NotificationBar';
import UserPosts from './components/posts/UserPosts';

function App() {
  const dispatch = useDispatch();

  const { currentPath, userData } = useSelector((state) => state.navigationReducer);

  useEffect(() => {
    if (window.location.pathname !== currentPath) {
      dispatch(setCurrentPath(window.location.pathname));
    }
  }, [dispatch, currentPath]);

  useEffect(() => {
    const handler = () => {
      dispatch(setCurrentPath(window.location.pathname));
    };
    window.addEventListener('popstate', handler);

    return () => {
      window.removeEventListener('popstate', handler);
    }
  }, [dispatch]);

  if (currentPath === '/user-info' && !userData) dispatch(setCurrentPath('/'));

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-1 sm:grid sm:grid-cols-[1fr] sm:grid-rows-[1fr,_auto]">
      <Sidebar />
      <main className="relative grow sm:overflow-auto">
        <NotificationBar />

        <Route path="/">
          <HomePage />
        </Route>

        <Route path="/subscriptions">
          <div className="flex items-stretch h-full p-6">
            <UserPosts arrayName="subscriptions" />
          </div>
        </Route>

        <Route path="/marked">
          <div className="flex items-stretch h-full p-6">
            <UserPosts arrayName="marked" />
          </div>
        </Route>

        <Route path="/profile">
          <UserProfilePage />
        </Route>

        <Route path="/user-info">
          <UserInfoPage />
        </Route>
      </main>
    </div>
  );
}

export default App;
