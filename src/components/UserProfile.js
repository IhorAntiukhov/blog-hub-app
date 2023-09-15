import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import {
  reauthenticateWithCredential,
  updateProfile,
  updateEmail,
  updatePassword,
  signOut,
  EmailAuthProvider
} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../firebase-config';
import { BiSolidUser } from 'react-icons/bi';
import { MdEmail, MdLock, MdLogout } from 'react-icons/md';
import { showNotification } from '../store';
import PhotoSelect from './PhotoSelect';
import Input from './Input';
import Button from './Button';
import ReactIcon from './ReactIcon';

function UserProfile() {
  const [userPhoto, setUserPhoto] = useState(
    (auth.currentUser.providerData[0].providerId !== 'google.com') ?
      auth.currentUser.photoURL : auth.currentUser.providerData[0].photoURL);

  const [userName, setUserName] = useState(auth.currentUser.displayName || auth.currentUser.providerData[0].displayName);
  const [userEmail, setUserEmail] = useState(auth.currentUser.email);

  const [userPassword, setUserPassword] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const dispatch = useDispatch();

  const updateUserProfile = async (photo) => {
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
      } else {
        await updateProfile(auth.currentUser, {
          displayName: userName, photoURL: ""
        });
      }

      setUserPhoto(photo);
      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'User profile updated'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to update profile'
      }));
    }
  }

  const updateUserEmail = async () => {
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
  }

  const updateUserPassword = async () => {
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
  }

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
  }

  return (
    <section className="flex flex-col items-center self-start space-y-4 p-6 bg-[white] rounded-xl shadow-lg">
      <PhotoSelect value={userPhoto} onChange={updateUserProfile} />

      <div className="flex flex-col space-y-2 w-full">
        <Input value={userName} onChange={(text) => { setUserName(text) }} onUpdate={updateUserProfile}
          type="text" placeholder="User name" icon={<BiSolidUser className="h-8 w-8" />} updateButton />
        <Input value={userEmail} onChange={(text) => { setUserEmail(text) }} onUpdate={updateUserEmail}
          type="text" placeholder="User email" icon={<MdEmail className="h-8 w-8" />} updateButton />
      </div>

      <div className="flex flex-col space-y-2">
        <Input value={userPassword} onChange={(text) => { setUserPassword(text) }}
          type="password" placeholder="Current password" icon={<MdLock className="h-8 w-8" />} />
        <Input value={newUserPassword} onChange={(text) => { setNewUserPassword(text) }} onUpdate={updateUserPassword}
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
