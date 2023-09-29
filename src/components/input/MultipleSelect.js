import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';
import ReactIcon from '../other/ReactIcon';

function MultipleSelect({ value, onChange, title, options }) {
  const [isOpen, setIsOpen] = useState(0);
  const multipleSelectEl = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (multipleSelectEl.current === null || isOpen === 0) return;
      if (!multipleSelectEl.current.contains(event.target)) setIsOpen(1);
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen]);

  const changeSelectedOptions = (event, option) => {
    if (event.target.checked) {
      onChange([...value, option]);
    } else {
      const selectedOptions = [...value];
      onChange(selectedOptions.filter((selectedOption) => selectedOption !== option));
    }
  }

  const checkboxClass = classNames('relative', 'text-xl 2xl:text-lg', 'pl-10', 'cursor-pointer',
    'before:absolute', 'before:left-0', 'before:top-1/2', 'before:-translate-y-1/2',
    'before:inline-block', 'before:w-6', 'before:h-6', 'before:my-auto', 'before:bg-primary',
    'before:rounded-[30%]', 'before:duration-150', 'before:transition-[opacity,transform]',
    'before:hover:opacity-75', 'before:active:scale-110');

  const multipleSelectClass = classNames('flex', 'justify-between', 'space-x-2', 'items-center', 'w-60', 'px-4', 'py-2.5',
    'bg-neutral-3', 'rounded-lg', 'border-4', 'border-neutral-2', 'cursor-pointer');

  const multipleSelectOptionsClass = classNames('absolute', 'z-20', 'flex', 'flex-col', 'w-full', 'bg-neutral-3', 'rounded-lg',
    'origin-top', { 'animate-open-dropdown': isOpen === 2, 'animate-close-dropdown': isOpen === 1, 'hidden': isOpen === 0 });

  const renderedOptions = options.map((option) => (
    <div key={option} className="px-4 py-2.5 border-b-[3px] border-b-neutral-2 last:border-b-0">
      <input className="absolute -z-10 w-[0.1px] h-[0.1px] opacity-0" type="checkbox" id={option}
        checked={value.indexOf(option) !== -1} onChange={(event) => { changeSelectedOptions(event, option) }} />
      <label className={checkboxClass} htmlFor={option}>{option}</label>
    </div>
  ));

  return (
    <div className="relative space-y-1" ref={multipleSelectEl}>
      <div className={multipleSelectClass} onClick={() => { setIsOpen((isOpen === 2) ? 1 : 2) }}>
        <p className="text-xl 2xl:text-lg">{title}</p>
        <ReactIcon src={(isOpen === 2) ?
          <BiSolidUpArrow className="w-4 h-4" /> :
          <BiSolidDownArrow className="w-4 h-4" />} />
      </div>
      <div className={multipleSelectOptionsClass}>
        {renderedOptions}
      </div>
    </div>
  );
}

export default MultipleSelect;
