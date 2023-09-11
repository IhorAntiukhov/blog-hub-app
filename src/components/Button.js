import classNames from 'classnames';

function Button({ children, className, ...rest }) {
  const buttonClass = classNames(
    'px-6', 'py-2', 'text-xl', 'bg-primary', 'text-[white]',
    'rounded-lg', 'duration-150', 'hover:opacity-75', className
  );

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
}

export default Button;
