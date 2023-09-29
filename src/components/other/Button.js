import classNames from 'classnames';

function Button({ children, className, secondary, error, ...rest }) {
  const buttonClass = classNames(
    'flex', 'justify-center', 'items-center', 'space-x-2', 'px-6', 'py-2', 'text-xl 2xl:text-lg', 'text-[white]', 'whitespace-nowrap',
    { 'bg-primary': !secondary && !error, 'bg-secondary': secondary, 'bg-error': error }, 'rounded-lg', 'duration-150',
    { 'hover:bg-primarySaturated': !secondary && !error, 'hover:bg-secondarySaturated': secondary, 'hover:bg-errorSaturated': error },
    className
  );

  return (
    <button className={buttonClass} {...rest} type="button">
      {children}
    </button>
  );
}

export default Button;
