import { useState } from 'react';
import { MdAdd, MdArrowBack } from 'react-icons/md';
import Button from './Button';
import ReactIcon from './ReactIcon';
import SortCriteria from './SortCriteria';
import MultipleSelect from './MultipleSelect';
import PostEditor from './PostEditor';

function UserPosts() {
  const [addBlogMode, setAddBlogMode] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState(['Entertaiment', 'Science', 'Games']);
  const [blogTopics, setBlogTopics] = useState([]);

  return (
    <section className="flex flex-col items-center grow bg-[white] rounded-xl shadow-lg">
      <header className="flex justify-between items-center w-full p-6 border-b-2 border-neutral-3">
        <Button onClick={() => { setAddBlogMode(!addBlogMode) }}>
          {(addBlogMode) ?
            <ReactIcon src={<MdArrowBack className="w-6 h-6" />} color="white" /> :
            <ReactIcon src={<MdAdd className="w-6 h-6" />} color="white" />}
          <span>{(addBlogMode) ? 'Back to posts' : 'Add new post'}</span>
        </Button>

        {!addBlogMode && <div className="flex space-x-4">
          <SortCriteria title="Reactions" />
          <SortCriteria title="Publish date" />
        </div>}

        {(addBlogMode) ? <MultipleSelect value={blogTopics} onChange={(value) => { setBlogTopics(value) }}
          title="Topics" options={['Entertaiment', 'Science', 'Games']} /> :
          <MultipleSelect value={filteredTopics} onChange={(value) => { setFilteredTopics(value) }}
            title="Topics" options={['Entertaiment', 'Science', 'Games']} />}
      </header>

      {!addBlogMode && <div className="grow w-full p-6 border-b-2 border-neutral-3">

      </div>}

      {addBlogMode && <PostEditor topics={blogTopics} />}

      {!addBlogMode && <footer className="flex justify-around items-center w-full p-4">
        <p className="text-neutral-4">Number of posts: { }</p>
        <p className="text-neutral-4">Number of reactions: { }</p>
      </footer>}
    </section>
  );
}

export default UserPosts;
