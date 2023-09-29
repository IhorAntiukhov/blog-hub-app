import classNames from 'classnames';
import { BiSolidCameraPlus } from 'react-icons/bi';
import ReactIcon from '../other/ReactIcon';

function PhotoSelect({ value, onChange }) {
  let photo;
  if (typeof value !== 'string') {
    try {
      photo = URL.createObjectURL(value);
    } catch (error) {
      photo = null;
    }
  } else {
    photo = value;
  }

  const userPhotoClass = classNames('relative', { 'bg-secondary p-4': !value }, 'rounded-full', 'duration-150', 'transition-[opacity]', 'hover:opacity-75');

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={userPhotoClass}>
        <label className="cursor-pointer" htmlFor="userPhoto">
          {(value && photo) ?
            <img className="w-36 h-36 rounded-full object-cover" src={photo} alt="" /> :
            <ReactIcon src={<BiSolidCameraPlus className="w-28 h-28" />} color="" />}
        </label>

        <input className="absolute -z-10 w-[0.1px] h-[0.1px] opacity-0" id="userPhoto" type="file"
          onChange={(event) => {
            event.target.files[0] && onChange(event.target.files[0])
          }} />
      </div>
      {(value && photo) ?
        <p className="cursor-pointer" onClick={() => { onChange(null, true) }}>Reset user photo</p> :
        <p>Select user photo</p>}
    </div>
  );
}

export default PhotoSelect;
