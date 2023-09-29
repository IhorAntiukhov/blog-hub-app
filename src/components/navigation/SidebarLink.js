import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { setCurrentPath } from '../../store';

function SidebarLink({ href, title, selected, children }) {
  const dispatch = useDispatch();

  const navigateToPage = (event) => {
    event.preventDefault();
    dispatch(setCurrentPath(href));
  }

  const linkClass = classNames('flex', 'flex-col', 'items-center', 'space-y-0.5', 'px-5', 'py-1.5', 'whitespace-nowrap',
    { 'bg-neutral-1': selected }, 'duration-150', 'hover:opacity-75');

  const titleClass = classNames({ 'text-accent': selected, 'text-secondary': !selected })

  return (
    <a className={linkClass} href={href} onClick={navigateToPage}>
      {children}
      <p className={titleClass}>{title}</p>
    </a>
  )
}

export default SidebarLink;
