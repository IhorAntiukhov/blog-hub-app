import { useSelector } from 'react-redux';
import { BiSolidUser, BiSolidCalendar } from 'react-icons/bi';
import { HiUserAdd } from 'react-icons/hi';
import ReactIcon from './ReactIcon';
import Button from './Button';

function UserInfo() {
  const { userData } = useSelector((state) => state.navigationReducer)

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
        <Button className="w-full bg-primary hover:bg-primarySaturated" onClick={() => { }}>
          <ReactIcon src={<HiUserAdd className="w-6 h-6" />} color="white" />
          <span>Subscribe</span>
        </Button>
      </div>
    </div>
  );
}

export default UserInfo;
