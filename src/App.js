import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentPath } from './store';
import Sidebar from './components/Sidebar';
import Route from './components/Route';
import UserProfilePage from './pages/UserProfilePage';
import NotificationBar from './components/NotificationBar';
import HomePage from './pages/HomePage';
import UserInfoPage from './pages/UserInfoPage';
import UserPosts from './components/UserPosts';

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
    <div className="flex h-screen overflow-hidden bg-neutral-1">
      <Sidebar />
      <main className="relative grow">
        <NotificationBar />

        <Route path="/">
          <HomePage />
        </Route>

        <Route path="/subscriptions">
          <div className="flex flex-col h-full p-6">
            <UserPosts arrayName="subscriptions" />
          </div>
        </Route>

        <Route path="/marked">
          <div className="flex flex-col h-full p-6">
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
