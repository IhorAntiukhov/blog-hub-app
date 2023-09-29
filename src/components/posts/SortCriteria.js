import { useDispatch, useSelector } from 'react-redux';
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';
import { setSort } from '../../store';
import ReactIcon from '../other/ReactIcon';

function SortCriteria({ title }) {
  const { sortCriteria, sortOrder } = useSelector((state) => state.userPostsReducer);
  const dispatch = useDispatch();

  const setAscendingOrder = () => {
    dispatch(setSort({
      criteria: title,
      order: (!(sortCriteria === title && sortOrder === 1)) ? 1 : 0
    }));
  }

  const setDescendingOrder = () => {
    dispatch(setSort({
      criteria: title,
      order: (!(sortCriteria === title && sortOrder === 2)) ? 2 : 0
    }));
  }

  return (
    <div className="flex items-center space-x-3">
      <p className="text-xl 2xl:text-lg">{title}</p>
      <div className="flex flex-col justify-center space-y-1">
        <ReactIcon src={
          <BiSolidUpArrow className="w-4 h-4 cursor-pointer duration-150 hover:opacity-60" onClick={setAscendingOrder} />
        } color={(sortCriteria === title && sortOrder === 1) ? '#73C67E' : 'black'} />
        <ReactIcon src={
          <BiSolidDownArrow className="w-4 h-4 cursor-pointer duration-150 hover:opacity-60" onClick={setDescendingOrder} />
        } color={(sortCriteria === title && sortOrder === 2) ? '#73C67E' : 'black'} />
      </div>
    </div>
  );
}

export default SortCriteria;
