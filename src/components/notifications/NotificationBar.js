import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Notification from './Notification';

function NotificationBar() {
  const notifications = useSelector((state) => state.navigationReducer.notifications);
  const confirmNotification = notifications.find((notification) => notification.type === 'Confirm');

  let content;
  if (confirmNotification) {
    content = <Notification notification={confirmNotification} />
  } else {
    content = notifications.map((notification) => (
      <Notification key={notification.id} notification={notification} />
    ));
  }

  const notificationBarClass = classNames('absolute', 'top-4', { 'left-4': !confirmNotification, 'left-1/2 -translate-x-1/2': confirmNotification },
    'flex flex-col', 'space-y-2');

  return (
    <div className={notificationBarClass}>
      {content}
    </div>
  );
}

export default NotificationBar;
