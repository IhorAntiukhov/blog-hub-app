import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { addFilteringTopic, removeFilteringTopic, setFilterByPopularity } from '../../store';
import TOPICS_LIST from '../..';

function TopPanel() {
  const { filterByPopularity, filteringTopics } = useSelector((state) => state.allPostsReducer);
  const dispatch = useDispatch();

  const filterByPopularityOptions = ['Recent', 'Popular', 'Marked'];

  const filterByPopularityContent = filterByPopularityOptions.map((option) => {
    const optionClass = classNames('px-4', 'py-1.5', 'text-lg',
      {
        'bg-neutral-3 hover:bg-neutralSaturated-1': filterByPopularity !== option,
        'bg-neutral-4 text-[white] hover:bg-neutralSaturated-2': filterByPopularity === option
      },
      'rounded-lg', 'cursor-pointer', 'duration-150');

    return <div key={option} className={optionClass}
      onClick={() => {
        dispatch(setFilterByPopularity(option));
      }}>
      {option}
    </div>
  });

  const filterByTopicsContent = TOPICS_LIST.map((option) => {
    const optionClass = classNames('px-4', 'py-1.5', 'text-lg',
      {
        'bg-neutral-3 hover:bg-neutralSaturated-1': !filteringTopics.includes(option),
        'bg-neutral-4 text-[white] hover:bg-neutralSaturated-2': filteringTopics.includes(option)
      },
      'rounded-lg', 'cursor-pointer', 'duration-150');

    return <div key={option} className={optionClass}
      onClick={() => {
        dispatch((filteringTopics.includes(option)) ? removeFilteringTopic(option) : addFilteringTopic(option));
      }}>
      {option}
    </div>
  });

  return (
    <div className="flex flex-wrap justify-center space-x-4 lg:space-x-0 lg:gap-2">
      <div className="flex space-x-2 pr-4 border-r-2 border-r-neutral-3 lg:border-r-0">
        {filterByPopularityContent}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterByTopicsContent}
      </div>
    </div>
  );
}

export default TopPanel;
