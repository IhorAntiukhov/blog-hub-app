import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { BiSolidUserRectangle } from 'react-icons/bi';
import { MdEmail, MdLock } from 'react-icons/md';
import { setSignInOrSignUp } from '../store';
import { auth } from '../firebase-config';
import ReactIcon from './ReactIcon';
import Input from './Input';
import Button from './Button';

function SignUp() {
  const [userEmail, setUserEmail] = useState('');

  const [userPassword, setUserPassword] = useState('');
  const [confirmedUserPassword, setConfirmedUserPassword] = useState('');

  const dispatch = useDispatch();

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, userEmail, userPassword);
    } catch (error) { }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center p-6 bg-[white] rounded-xl">
        <ReactIcon src={<BiSolidUserRectangle className="w-28 h-28 mb-4" />} color="" />

        <div className="flex flex-col space-y-2 w-full mb-4">
          <Input value={userEmail} onChange={(text) => { setUserEmail(text) }}
            type="text" placeholder="User email" icon={<MdEmail className="h-8 w-8" />} />
        </div>

        <div className="flex flex-col space-y-2 mb-4">
          <Input value={userPassword} onChange={(text) => { setUserPassword(text) }}
            type="password" placeholder="User password" icon={<MdLock className="h-8 w-8" />} />
          <Input value={confirmedUserPassword} onChange={(text) => { setConfirmedUserPassword(text) }}
            type="password" placeholder="Confirm password" icon={<MdLock className="h-8 w-8" />} />
        </div>

        <Button className="w-full mb-6" onClick={signUp}>Sign Up</Button>

        <p>Already have an account? <span className="text-secondary cursor-pointer"
          onClick={() => { dispatch(setSignInOrSignUp('signIn')) }}>Sign in</span></p>
      </div>
    </div>
  );
}

export default SignUp;
