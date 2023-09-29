import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { deleteDoc, doc } from 'firebase/firestore';
import classNames from 'classnames';
import { IoMdClose } from 'react-icons/io';
import { showNotification, hideNotification, setPostContent, deletePost } from '../../store';
import { db } from '../../firebase-config';
import ReactIcon from '../other/ReactIcon';

function Notification({ notification }) {
  const dispatch = useDispatch();

  const removeNotification = useCallback(() => {
    dispatch(hideNotification(notification.id));
  }, [dispatch, notification.id]);

  useEffect(() => {
    setTimeout(removeNotification, (notification.type === 'Confirm') ? 10000 : 4000);
  }, [removeNotification, notification.type]);

  const handleConfirm = () => {
    if (notification.text === 'Delete post?') {
      const removePost = async () => {
        try {
          await deleteDoc(doc(db, 'users', notification.post.uid, 'posts', notification.post.id));

          dispatch(deletePost(notification.post));
          dispatch(hideNotification(notification.id));

          dispatch(showNotification({
            id: nanoid(), type: 'Info', text: 'Post deleted'
          }));
        } catch (error) {
          dispatch(showNotification({
            id: nanoid(), type: 'Error', text: 'Failed to delete post'
          }));
        }
      };

      removePost();
    } else if (notification.text === 'Clear post content?') {
      dispatch(setPostContent(''));
      dispatch(hideNotification(notification.id));
    }
  }

  const notificationClass = classNames('z-10', 'flex', 'flex-col', 'space-y-1', 'px-4', 'py-2.5',
    {
      'bg-info': notification.type !== 'Error',
      'bg-error': notification.type === 'Error',
      'animate-shift-right': notification.type !== 'Confirm',
      'animate-shift-down': notification.type === 'Confirm'
    },
    'rounded-lg');

  return (
    <div className={notificationClass}>
      <div className="flex justify-between items-center space-x-4 mb-1">
        <p className="text-xl text-[white]">{notification.type}</p>
        <ReactIcon src={<IoMdClose className="w-5 h-5 cursor-pointer" onClick={removeNotification} />} color="white" />
      </div>

      <p className="text-lg text-[white]">{notification.text}</p>

      {notification.type === 'Confirm' &&
        <p className="self-end text-lg font-bold text-[white] cursor-pointer" onClick={handleConfirm}>Confirm</p>}
    </div>
  );
}

export default Notification;
