import { useState } from 'react';
import classNames from 'classnames';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import { GrUpdate } from 'react-icons/gr';
import ReactIcon from '../other/ReactIcon';

function Input({ value, onChange, onSubmit, type, placeholder, icon, updateButton, largeFont }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!!onSubmit) onSubmit();
  }

  const toggleIcon = (showPassword) ?
    <BiSolidHide className="h-8 w-8 cursor-pointer hover:opacity-75" onClick={() => { setShowPassword(false) }} /> :
    <BiSolidShow className="h-8 w-8 cursor-pointer hover:opacity-75" onClick={() => { setShowPassword(true) }} />

  const inputParentClass = classNames('flex', 'space-x-2', 'items-center', 'px-4', 'py-2.5',
    'bg-neutral-3', 'rounded-lg', 'border-4', 'border-neutral-2');

  const inputClass = classNames('grow', { 'text-xl 2xl:text-lg': !largeFont, 'text-2xl': largeFont }, 'bg-[transparent]', 'outline-0');

  return (
    <form className={inputParentClass} onSubmit={handleSubmit}>
      <ReactIcon src={icon} color="#73C67E" />

      <input className={inputClass} placeholder={placeholder} type={(showPassword || type !== 'password') ? 'text' : 'password'}
        value={value} onInput={(event) => { onChange(event.target.value) }} maxLength={100} />

      {type === 'password' && <ReactIcon src={toggleIcon} color="" />}
      {updateButton &&
        <ReactIcon src={<GrUpdate className="h-6 w-6 cursor-pointer hover:opacity-75" onClick={handleSubmit} />} color="" />}
    </form>
  );
}

export default Input;
