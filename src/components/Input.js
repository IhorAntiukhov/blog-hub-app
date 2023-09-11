import classNames from 'classnames';
import { useState } from 'react';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import ReactIcon from './ReactIcon';

function Input({ value, onChange, type, placeholder, icon }) {
  const [showPassword, setShowPassword] = useState(false);

  const inputClass = classNames('flex', 'space-x-2', 'items-center', 'px-4', 'py-2.5',
    'bg-neutral-3', 'rounded-lg', 'border-4', 'border-neutral-2');

  const toggleIcon = (showPassword) ?
    <BiSolidHide className="h-8 w-8 hover:opacity-75" onClick={() => { setShowPassword(false) }} /> :
    <BiSolidShow className="h-8 w-8 hover:opacity-75" onClick={() => { setShowPassword(true) }} />

  return (
    <div className={inputClass}>
      <ReactIcon src={icon} color="#73C67E" />

      <input className="text-xl bg-[transparent] outline-0" placeholder={placeholder}
        type={(showPassword || type !== 'password') ? 'text' : 'password'}
        value={value} onInput={(event) => { onChange(event.target.value) }} />

      {type === 'password' && <ReactIcon src={toggleIcon} color="#73C67E" />}
    </div>
  );
}

export default Input;