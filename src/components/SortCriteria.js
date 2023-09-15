import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';
import ReactIcon from './ReactIcon';

function SortCriteria({ title }) {
  return (
    <div className="flex items-center space-x-3">
      <p className="text-xl">{title}</p>
      <div className="flex flex-col justify-center space-y-1">
        <ReactIcon src={<BiSolidUpArrow className="w-4 h-4 cursor-pointer duration-150 hover:opacity-60" />} color="" />
        <ReactIcon src={<BiSolidDownArrow className="w-4 h-4 cursor-pointer duration-150 hover:opacity-60" />} color="" />
      </div>
    </div>
  );
}

export default SortCriteria;
