import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { setSignInOrSignUp, showNotification } from '../store';
import { BiSolidUserRectangle } from 'react-icons/bi';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';
import { db, auth, googleProvider } from '../firebase-config';
import ReactIcon from './ReactIcon';
import Input from './Input';
import Button from './Button';
import google from '../svg/google.svg';
import { nanoid } from '@reduxjs/toolkit';

function SignIn() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const dispatch = useDispatch();

  const resetPassword = async () => {
    if (!userEmail) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Enter your email'
      }));

      return;
    }

    try {
      await sendPasswordResetEmail(auth, userEmail);
      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: `Reset email sent to ${userEmail}`
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to send email'
      }));
    }
  }

  const setUserData = async () => {
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'posts', 'userData'), {
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL || '',
        name: auth.currentUser.displayName || ''
      });
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to set user data. Try to sign in again.'
      }));
    }
  }

  const signInWithEmail = async () => {
    if (!userEmail || !userPassword) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Fill in all the fields'
      }));

      return;
    }

    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
      await setUserData();

      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'Logged in successfully'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to login to user'
      }));
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await setUserData();

      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'Successfully logged in using Google'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to login to user'
      }));
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <section className="flex flex-col items-center p-6 bg-[white] rounded-xl shadow-lg">
        <ReactIcon src={<BiSolidUserRectangle className="w-28 h-28 mb-4" />} color="" />

        <div className="flex flex-col space-y-2 mb-4">
          <Input value={userEmail} onChange={(text) => { setUserEmail(text) }}
            type="text" placeholder="User email" icon={<MdEmail className="h-8 w-8" />} />
          <Input value={userPassword} onChange={(text) => { setUserPassword(text) }}
            type="password" placeholder="User password" icon={<MdLock className="h-8 w-8" />} />

          <p className="self-end text-lg cursor-pointer" onClick={resetPassword}>Forgot password?</p>
        </div>

        <div className="columns-2 w-full mb-6">
          <Button className="w-full" onClick={signInWithEmail}>
            <ReactIcon src={<MdLogin className="h-6 w-6" />} color="white" />
            <span>Sign In</span>
          </Button>

          <Button className="w-full" onClick={signInWithGoogle}>
            <img className="w-6 h-6" src={google} alt="" />
            <span>Google</span>
          </Button>
        </div>

        <p>Don't have an account yet? <span className="text-secondary cursor-pointer"
          onClick={() => { dispatch(setSignInOrSignUp('signUp')) }}>Sign up</span></p>
      </section>
    </div>
  );
}

export default SignIn;
