import { useSelector } from 'react-redux';
import Notification from './Notification';

function NotificationBar() {
  const notifications = useSelector((state) => state.navigationReducer.notifications);

  const content = notifications.map((notification) => (
    <Notification key={notification.id} notification={notification} />
  ));

  return (
    <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
      {content}
    </div>
  );
}

export default NotificationBar;
