import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../store';

function SidebarLink({ href, title, selected, children }) {
  const dispatch = useDispatch();

  const navigateToPage = (event) => {
    event.preventDefault();

    window.history.pushState({}, '', href);
    dispatch(setCurrentPath(href));
  }

  return (
    <a
      className={`flex flex-col items-center space-y-0.5 px-5 py-1.5 ${(selected) ? 'bg-neutral-1' : ''}`}
      href={href}
      onClick={navigateToPage}>
      {children}
      <p className={`font-sans ${(selected) ? 'text-accent' : 'text-secondary'}`}>{title}</p>
    </a>
  )
}

export default SidebarLink;
