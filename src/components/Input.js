import classNames from 'classnames';
import { useState } from 'react';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import { GrUpdate } from 'react-icons/gr';
import ReactIcon from './ReactIcon';

function Input({ value, onChange, type, placeholder, icon, updateButton, largeFont, onUpdate }) {
  const [showPassword, setShowPassword] = useState(false);

  const inputParentClass = classNames('flex', 'space-x-2', 'items-center', 'px-4', 'py-2.5',
    'bg-neutral-3', 'rounded-lg', 'border-4', 'border-neutral-2');

  const inputClass = classNames('grow', { 'text-xl': !largeFont, 'text-2xl': largeFont }, 'bg-[transparent]', 'outline-0');

  const toggleIcon = (showPassword) ?
    <BiSolidHide className="h-8 w-8 hover:opacity-75" onClick={() => { setShowPassword(false) }} /> :
    <BiSolidShow className="h-8 w-8 hover:opacity-75" onClick={() => { setShowPassword(true) }} />

  return (
    <div className={inputParentClass}>
      <ReactIcon src={icon} color="#73C67E" />

      <input className={inputClass} placeholder={placeholder}
        type={(showPassword || type !== 'password') ? 'text' : 'password'}
        value={value} onInput={(event) => { onChange(event.target.value) }} maxLength={100} />

      {type === 'password' && <ReactIcon src={toggleIcon} color="" />}
      {updateButton && <button title="Update">
        <ReactIcon src={<GrUpdate className="h-6 w-6 hover:opacity-75" onClick={() => { onUpdate() }} />} color="" />
      </button>}
    </div>
  );
}

export default Input;
