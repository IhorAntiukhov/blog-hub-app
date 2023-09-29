import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import {
  reauthenticateWithCredential,
  updateProfile,
  updateEmail,
  updatePassword,
  signOut,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { BiSolidUser } from 'react-icons/bi';
import { MdEmail, MdLock, MdLogout } from 'react-icons/md';
import { showNotification } from '../../store';
import { auth, db, storage } from '../../firebase-config';
import PhotoSelect from '../input/PhotoSelect';
import Input from '../input/Input';
import Button from '../other/Button';
import ReactIcon from '../other/ReactIcon';

function UserProfile() {
  const { subscribers, subscriptions } = useSelector((state) => state.userPostsReducer);

  const [userPhoto, setUserPhoto] = useState(
    (auth.currentUser?.providerData[0].providerId !== 'google.com' || auth.currentUser?.photoURL !== '') ?
      auth.currentUser?.photoURL : auth.currentUser?.providerData[0].photoURL);

  const [userName, setUserName] = useState(auth.currentUser?.displayName || auth.currentUser?.providerData[0].displayName || '');
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email);

  const [userPassword, setUserPassword] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const dispatch = useDispatch();

  const updateUserProfile = async (photo, resetPhoto) => {
    if (!userName) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Enter user name'
      }));

      return;
    }

    try {
      if (photo) {
        const userRef = ref(ref(storage), auth.currentUser.uid);
        const userPhotoRef = ref(userRef, 'user-photo.' + photo.name.substring(photo.name.lastIndexOf('.') + 1, photo.name.length) || photo.name);

        await uploadBytes(userPhotoRef, photo);
        const downloadURL = await getDownloadURL(userPhotoRef);

        await updateProfile(auth.currentUser, {
          displayName: userName, photoURL: downloadURL
        });
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', 'userData'), {
          photoURL: downloadURL,
          name: userName
        });

        setUserPhoto(photo);
      } else if (resetPhoto) {
        await updateProfile(auth.currentUser, {
          displayName: userName, photoURL: ''
        });
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', 'userData'), {
          photoURL: '',
          name: userName
        });

        setUserPhoto(photo);
      } else {
        await updateProfile(auth.currentUser, {
          displayName: userName
        });
        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', 'userData'), {
          name: userName
        });
      }

      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'User profile updated'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to update profile'
      }));
    }
  };

  const updateUserEmail = async () => {
    if (auth.currentUser.providerData[0].providerId === 'google.com') {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'You cannot change a user\'s email with the Google provider.'
      }));

      return;
    }

    if (!userEmail || !userPassword) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Enter new email and current password'
      }));

      return;
    }

    if (!userEmail.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Incorrect email format'
      }));

      return;
    }

    try {
      await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email, userPassword));

      await updateEmail(auth.currentUser, userEmail);
      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'User email updated'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to update email'
      }));
    }
  };

  const updateUserPassword = async () => {
    if (auth.currentUser.providerData[0].providerId === 'google.com') {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'You cannot change a user\'s password with the Google provider.'
      }));

      return;
    }

    if (!userPassword || !newUserPassword) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Enter current and new password'
      }));

      return;
    }

    if (newUserPassword.length < 6) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'The password must be at least 6 characters long'
      }));

      return;
    }

    try {
      await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email, userPassword));
      await updatePassword(auth.currentUser, newUserPassword);

      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'User password updated'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to update password'
      }));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'Logged out'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to log out user'
      }));
    }
  };

  return (
    <section className="flex flex-col items-center self-start space-y-4 p-6 bg-[white] rounded-xl shadow-lg lg:self-center">
      <PhotoSelect value={userPhoto} onChange={updateUserProfile} />

      <div className="flex space-x-2">
        <p>{subscribers} subscribers</p>
        <p>{subscriptions} subscriptions</p>
      </div>

      <div className="flex flex-col space-y-2 w-full">
        <Input value={userName} onChange={(text) => { setUserName(text) }} onSubmit={updateUserProfile}
          type="text" placeholder="User name" icon={<BiSolidUser className="h-8 w-8" />} updateButton />
        <Input value={userEmail} onChange={(text) => { setUserEmail(text) }} onSubmit={updateUserEmail}
          type="text" placeholder="User email" icon={<MdEmail className="h-8 w-8" />} updateButton />
      </div>

      <div className="flex flex-col space-y-2">
        <Input value={userPassword} onChange={(text) => { setUserPassword(text) }}
          type="password" placeholder="Current password" icon={<MdLock className="h-8 w-8" />} />
        <Input value={newUserPassword} onChange={(text) => { setNewUserPassword(text) }} onSubmit={updateUserPassword}
          type="password" placeholder="New password" icon={<MdLock className="h-8 w-8" />} updateButton />
      </div>

      <Button className="w-full bg-secondary hover:bg-secondarySaturated" onClick={logout}>
        <ReactIcon src={<MdLogout className="w-6 h-6" />} color="black" />
        <span className="text-[black]">Logout</span>
      </Button>
    </section>
  );
}

export default UserProfile;
