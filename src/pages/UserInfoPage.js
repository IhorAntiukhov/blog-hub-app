import UserInfo from '../components/user/UserInfo';
import UserPosts from '../components/posts/UserPosts';

function UserInfoPage() {
  return (
    <div className="flex items-stretch space-x-6 h-full p-6 lg:flex-col lg:space-y-6 lg:space-x-0 lg:overflow-auto">
      <UserInfo />
      <UserPosts arrayName="userPosts" />
    </div>
  )
}

export default UserInfoPage;
