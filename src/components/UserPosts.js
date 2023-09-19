import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDocs, collection } from 'firebase/firestore';
import { MdAdd, MdArrowBack } from 'react-icons/md';
import classNames from 'classnames';
import { setAllPosts, setAddEditPostMode } from '../store';
import { db, auth } from '../firebase-config';
import Button from './Button';
import ReactIcon from './ReactIcon';
import SortCriteria from './SortCriteria';
import MultipleSelect from './MultipleSelect';
import PostEditor from './PostEditor';
import Post from './Post';

function UserPosts() {
  const { allPosts, reactions, addEditPostMode, sortCriteria, sortOrder } = useSelector((state) => state.postsReducer);
  const dispatch = useDispatch();

  const [filteredTopics, setFilteredTopics] = useState(['Entertaiment', 'Science', 'Games']);
  const [blogTopics, setBlogTopics] = useState([]);

  const getAllPosts = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, auth.currentUser.uid));

    const postsData = [];
    querySnapshot.forEach((doc) => {
      postsData.push({
        ...doc.data(), id: doc.id,
        publishDate: doc.data().publishDate.toDate(),
        editDate: (doc.data().editDate !== '') ? doc.data().editDate.toDate() : ''
      });
    });
    dispatch(setAllPosts(postsData));
  }, [dispatch]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleSetPostMode = () => {
    dispatch(setAddEditPostMode({
      addEditPostMode: (addEditPostMode !== 0) ? 0 : 1
    }));
  }

  const sortedPosts = allPosts.filter((post) => {
    return !!post.topics.reduce(((accumulator, topic) => accumulator += (filteredTopics.includes(topic)) ? 1 : 0), 0);
  });

  if (sortCriteria === 'Reactions' && sortOrder === 1) {
    sortedPosts.sort((a, b) => a.reactions.length - b.reactions.length);
  }
  else if (sortCriteria === 'Reactions' && sortOrder === 2) {
    sortedPosts.sort((a, b) => b.reactions.length - a.reactions.length);
  }
  else if (sortCriteria === 'Publish date' && sortOrder === 1) {
    sortedPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }
  else if (sortCriteria === 'Publish date' && sortOrder === 2) {
    sortedPosts.sort((a, b) => a.publishDate.getTime() - b.publishDate.getTime());
  }
  else {
    sortedPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  }

  let content;
  if (allPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4">You haven't published any posts</p>;
  } else if (allPosts.length > 0 && sortedPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4">There are no posts on established topics</p>;
  } else {
    content = sortedPosts.map((post) =>
    (<Post key={post.id} post={post} onUpdate={getAllPosts} onEdit={(topics) => {
      setBlogTopics(topics);
    }} />
    ));
  }

  const allPostsClass = classNames({ 'flex justify-center items-center': sortedPosts.length === 0 },
    'grow', 'space-y-4', 'w-full', 'p-6', 'overflow-auto', '', 'border-b-2', 'border-neutral-3');

  return (
    <section className="flex flex-col items-center grow bg-[white] rounded-xl shadow-lg">
      <header className="flex justify-between items-center w-full p-6 border-b-2 border-neutral-3">
        <Button onClick={handleSetPostMode}>
          {(addEditPostMode) ?
            <ReactIcon src={<MdArrowBack className="w-6 h-6" />} color="white" /> :
            <ReactIcon src={<MdAdd className="w-6 h-6" />} color="white" />}
          <span>{(addEditPostMode) ? 'Back to posts' : 'Add new post'}</span>
        </Button>

        {!addEditPostMode && <div className="flex space-x-4">
          <SortCriteria title="Reactions" onSort />
          <SortCriteria title="Publish date" onSort />
        </div>}

        {(addEditPostMode) ? <MultipleSelect value={blogTopics} onChange={(value) => { setBlogTopics(value) }}
          title="Topics" options={['Entertaiment', 'Science', 'Games']} /> :
          <MultipleSelect value={filteredTopics} onChange={(value) => { setFilteredTopics(value) }}
            title="Topics" options={['Entertaiment', 'Science', 'Games']} />}
      </header>

      {!addEditPostMode && <div className={allPostsClass}>
        {content}
      </div>}

      {!!addEditPostMode && <PostEditor topics={blogTopics} onUpdate={getAllPosts} />}

      {!addEditPostMode && <footer className="flex justify-around items-center w-full p-4">
        <p className="text-neutral-4">Number of posts: {allPosts.length}</p>
        <p className="text-neutral-4">Number of reactions: {reactions}</p>
      </footer>}
    </section>
  );
}

export default UserPosts;
