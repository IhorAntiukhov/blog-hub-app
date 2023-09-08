import { useSelector } from 'react-redux';
import { BiSolidHome, BiSolidBookmark, BiSolidUser } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io'
import ReactIcon from './ReactIcon';
import SidebarLink from './SidebarLink';

function Sidebar() {
  const currentPath = useSelector((state) => state.navigationReducer.currentPath);

  const defineIconColor = (href) => {
    if (href === currentPath) {
      return '#00A9BC';
    }
    return '#73C67E';
  }

  return (
    <nav className=
      "flex flex-col justify-center space-y-8 h-full border-r-[3px] border-neutral-3 bg-neutral-2">
      <SidebarLink href="/" title="Home" selected={currentPath === '/'}>
        <ReactIcon
          src={<BiSolidHome className="w-12 h-12" />} color={defineIconColor('/')} />
      </SidebarLink>

      <SidebarLink href="/subscriptions" title="For you" selected={currentPath === '/subscriptions'}>
        <ReactIcon
          src={<IoMdNotifications className="w-12 h-12" />} color={defineIconColor('/subscriptions')} />
      </SidebarLink>

      <SidebarLink href="/marked" title="Marked" selected={currentPath === '/marked'}>
        <ReactIcon
          src={<BiSolidBookmark className="w-12 h-12" />} color={defineIconColor('/marked')} />
      </SidebarLink>

      <SidebarLink href="/profile" title="Profile" selected={currentPath === '/profile'}>
        <ReactIcon
          src={<BiSolidUser className="w-12 h-12" />} color={defineIconColor('/profile')} />
      </SidebarLink>
    </nav>
  );
}

export default Sidebar;