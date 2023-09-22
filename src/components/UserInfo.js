import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { BiSolidUser, BiSolidCalendar } from 'react-icons/bi';
import { HiUserAdd } from 'react-icons/hi';
import { MdPersonRemove } from 'react-icons/md';
import { addSubscriber, removeSubscriber, showNotification } from '../store';
import { db, auth } from '../firebase-config';
import ReactIcon from './ReactIcon';
import Button from './Button';

function UserInfo() {
  const { userData } = useSelector((state) => state.navigationReducer);
  const dispatch = useDispatch()

  const subscribe = async () => {
    try {
      if (userData.subscribers.indexOf(auth.currentUser.uid) === -1) {
        await updateDoc(doc(db, 'users', userData.uid, 'posts', 'userData'), {
          subscribers: arrayUnion(auth.currentUser.uid)
        });

        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', 'userData'), {
          subscriptions: arrayUnion(userData.uid)
        });

        dispatch(addSubscriber(auth.currentUser.uid));
      } else {
        await updateDoc(doc(db, 'users', userData.uid, 'posts', 'userData'), {
          subscribers: arrayRemove(auth.currentUser.uid)
        });

        await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', 'userData'), {
          subscriptions: arrayRemove(userData.uid)
        });

        dispatch(removeSubscriber(auth.currentUser.uid));
      }
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to subscribe to user'
      }));
    }
  }

  const formatDate = (date) => {
    const dateString = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return `${timeString} ${dateString}`
  }

  return (
    <div className="flex flex-col items-center self-start space-y-2 p-6 bg-[white] rounded-xl shadow-lg">
      {(userData.photoURL) ?
        <img className="w-36 h-36 rounded-full object-cover" src={userData.photoURL} alt="User logo" /> :
        <ReactIcon src={<BiSolidUser className="w-36 h-36 -mb-2" />} color="" />}
      <p className="text-2xl">{userData.name || 'Anonymous'}</p>

      <p>{userData.subscribers.length} subscribers</p>
      <p>{userData.subscriptions.length} subscriptions</p>

      <div className="flex items-center space-x-2">
        <ReactIcon src={<BiSolidCalendar className="w-8 h-8" />} />
        <p>Joined {formatDate(userData.creationTime.toDate())}</p>
      </div>

      <div className="w-full pt-2">
        <Button className="w-full bg-primary hover:bg-primarySaturated" onClick={subscribe}>
          <ReactIcon src={(userData.subscribers.indexOf(auth.currentUser.uid) === -1) ?
            <HiUserAdd className="w-6 h-6" /> :
            <MdPersonRemove className="w-6 h-6" />} color="white" />
          <span>{(userData.subscribers.indexOf(auth.currentUser.uid) === -1) ? 'Subscribe' : 'Unsubscribe'}</span>
        </Button>
      </div>
    </div>
  );
}

export default UserInfo;
