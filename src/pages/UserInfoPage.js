import UserInfo from '../components/UserInfo';
import UserPosts from '../components/UserPosts';

function UserInfoPage() {
  return (
    <div className="flex items-stretch space-x-6 h-full p-6">
      <UserInfo />
      <UserPosts />
    </div>
  )
}

export default UserInfoPage;
