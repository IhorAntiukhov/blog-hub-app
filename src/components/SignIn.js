import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { setSignInOrSignUp } from '../store';
import { BiSolidUserRectangle } from 'react-icons/bi';
import { MdEmail, MdLock } from 'react-icons/md';
import { auth, googleProvider } from '../firebase-config';
import ReactIcon from './ReactIcon';
import Input from './Input';
import Button from './Button';
import google from '../svg/google.svg';

function SignIn() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const dispatch = useDispatch();

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, userEmail);
    } catch (error) { }
  }

  const signInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, userEmail, userPassword);
    } catch (error) { }
  }

  const signInWithGoogle = async () => {
    try {
      signInWithPopup(auth, googleProvider);
    } catch (error) { }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center p-6 bg-[white] rounded-xl">
        <ReactIcon src={<BiSolidUserRectangle className="w-28 h-28 mb-4" />} color="" />

        <div className="flex flex-col space-y-2 mb-4">
          <Input value={userEmail} onChange={(text) => { setUserEmail(text) }}
            type="text" placeholder="User email" icon={<MdEmail className="h-8 w-8" />} />
          <Input value={userPassword} onChange={(text) => { setUserPassword(text) }}
            type="password" placeholder="User password" icon={<MdLock className="h-8 w-8" />} />

          <p className="self-end text-lg cursor-pointer" onClick={resetPassword}>Forgot password?</p>
        </div>

        <div className="columns-2 w-full mb-6">
          <Button className="w-full" onClick={signInWithEmail}>Sign In</Button>
          <Button className="flex justify-center items-center w-full" onClick={signInWithGoogle}>
            <img className="w-6 h-6 mr-2" src={google} alt="" />
            Google
          </Button>
        </div>

        <p>Don't have an account yet? <span className="text-secondary cursor-pointer"
          onClick={() => { dispatch(setSignInOrSignUp('signUp')) }}>Sign up</span></p>
      </div>
    </div>
  );
}

export default SignIn;
