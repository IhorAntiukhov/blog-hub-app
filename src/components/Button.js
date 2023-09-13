import classNames from 'classnames';

function Button({ children, className, error, ...rest }) {
  const buttonClass = classNames(
    'px-6', 'py-2', 'text-xl', { 'bg-primary': !error, 'bg-error': error },
    'text-[white]', 'rounded-lg', 'shadow-md', 'duration-150',
    { 'hover:bg-primarySaturated': !error, 'hover:bg-errorSaturated': error },
    className
  );

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
}

export default Button;
