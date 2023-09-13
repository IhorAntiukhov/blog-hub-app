import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { IoMdClose } from 'react-icons/io';
import { hideNotification } from '../store';
import ReactIcon from './ReactIcon';
import { useCallback, useEffect } from 'react';

function Notification({ notification }) {
  const dispatch = useDispatch();

  const removeNotification = useCallback(() => {
    dispatch(hideNotification(notification.id));
  }, [dispatch, notification.id]);

  useEffect(() => {
    setTimeout(removeNotification, 4000);
  }, [removeNotification]);

  const notificationClass = classNames('z-10', 'px-4', 'py-2.5',
    {
      'bg-info': notification.type === 'Info',
      'bg-error': notification.type === 'Error'
    },
    'rounded-lg', 'animate-shift-right');

  return (
    <div className={notificationClass}>
      <div className="flex justify-between items-center mb-1">
        <p className="text-xl text-[white] mr-4">{notification.type}</p>
        <ReactIcon src={<IoMdClose className="w-5 h-5 cursor-pointer" onClick={removeNotification} />} color="white" />
      </div>

      <p className="text-lg text-[white]">{notification.text}</p>
    </div>
  );
}

export default Notification;
