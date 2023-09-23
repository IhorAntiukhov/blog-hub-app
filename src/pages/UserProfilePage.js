import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import UserProfile from '../components/UserProfile';
import UserPosts from '../components/UserPosts';

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
        <div className="flex items-stretch space-x-6 h-full p-6">
          <UserProfile />
          <UserPosts arrayName="ownPosts" />
        </div>
      )}
    </>
  );
}

export default UserProfilePage;
