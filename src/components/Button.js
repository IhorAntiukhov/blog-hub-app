import classNames from 'classnames';

function Button({ children, className, secondary, error, ...rest }) {
  const buttonClass = classNames(
    'flex', 'justify-center', 'items-center', 'space-x-2', 'px-6', 'py-2', 'text-xl',
    { 'bg-primary': !secondary && !error, 'bg-secondary': secondary, 'bg-error': error },
    'rounded-lg', 'duration-150', 'text-[white]',
    { 'hover:bg-primarySaturated': !secondary && !error, 'hover:bg-secondarySaturated': secondary, 'hover:bg-errorSaturated': error },
    className
  );

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
}

export default Button;
