import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentPath } from './store';
import Sidebar from './components/Sidebar';
import Route from './components/Route';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  const dispatch = useDispatch();

  const currentPath = useSelector((state) => state.navigationReducer.currentPath);

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

  return (
    <div className="flex h-screen bg-neutral-1">
      <Sidebar />
      <main className="grow">
        <Route path="/">
        </Route>

        <Route path="/subscriptions">
        </Route>

        <Route path="/marked">
        </Route>

        <Route path="/profile">
          <UserProfilePage />
        </Route>
      </main>
    </div>
  );
}

export default App;
