import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import SignIn from '../components/user/SignIn';
import SignUp from '../components/user/SignUp';
import UserProfile from '../components/user/UserProfile';
import UserPosts from '../components/posts/UserPosts';

function UserProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signInOrSignUp = useSelector((state) => state.navigationReducer.signInOrSignUp);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <>
      {(!isLoggedIn && signInOrSignUp === 'signIn') && <SignIn />}
      {(!isLoggedIn && signInOrSignUp === 'signUp') && <SignUp />}
      {isLoggedIn && (
        <div className="flex items-stretch space-x-6 h-full p-6 lg:flex-col lg:space-y-6 lg:space-x-0 lg:overflow-auto">
          <UserProfile />
          <UserPosts arrayName="ownPosts" />
        </div>
      )}
    </>
  );
}

export default UserProfilePage;
