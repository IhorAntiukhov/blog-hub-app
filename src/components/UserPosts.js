import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { getDocs, collection } from 'firebase/firestore';
import { MdAdd, MdArrowBack } from 'react-icons/md';
import classNames from 'classnames';
import { setUserPosts, setAddEditPostMode, showNotification } from '../store';
import { auth, db } from '../firebase-config';
import Button from './Button';
import ReactIcon from './ReactIcon';
import SortCriteria from './SortCriteria';
import MultipleSelect from './MultipleSelect';
import PostEditor from './PostEditor';
import Post from './Post';
import TOPICS_LIST from '..';
import useSortPosts from '../hooks/use-sort-posts';

function UserPosts({ ownPosts }) {
  const { userPosts, reactions, addEditPostMode, userData } = useSelector((state) => ({ ...state.userPostsReducer, ...state.navigationReducer }));
  const dispatch = useDispatch();

  const [filteringTopics, setFilteringTopics] = useState(TOPICS_LIST);
  const [blogTopics, setBlogTopics] = useState([]);

  const getAllPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users', (ownPosts) ? auth.currentUser.uid : userData.uid, 'posts'));

      const postsData = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== 'userData') {
          postsData.push({
            ...doc.data(), id: doc.id,
            publishDate: doc.data().publishDate.toDate(),
            editDate: (doc.data().editDate !== '') ? doc.data().editDate.toDate() : ''
          });
        }
      });
      dispatch(setUserPosts(postsData));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'An error occurred while trying to retrieve posts'
      }));
    }
  }, [dispatch, ownPosts, userData]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleSetPostMode = () => {
    dispatch(setAddEditPostMode({
      addEditPostMode: (addEditPostMode !== 0) ? 0 : 1
    }));
  }

  const sortedPosts = useSortPosts(filteringTopics, 'userPosts');

  let content;
  if (userPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4">
      {(ownPosts) ? 'You haven\'t published any posts' : 'The user hasn\'t published any posts'}
    </p>;
  } else if (userPosts.length > 0 && sortedPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4">There are no posts on established topics</p>;
  } else {
    content = sortedPosts.map((post) =>
    (<Post key={post.id} post={post} onUpdate={getAllPosts} onEdit={(topics) => {
      setBlogTopics(topics);
    }} editButtons={ownPosts} />
    ));
  }

  const allPostsClass = classNames({ 'flex justify-center items-center': sortedPosts.length === 0 },
    'grow', 'space-y-4', 'w-full', 'p-6', 'overflow-auto', '', 'border-b-2', 'border-neutral-3');

  return (
    <section className="flex flex-col items-center grow bg-[white] rounded-xl shadow-lg">
      <header className="flex justify-between items-center w-full p-6 border-b-2 border-neutral-3">
        {ownPosts && <Button onClick={handleSetPostMode}>
          {(addEditPostMode) ?
            <ReactIcon src={<MdArrowBack className="w-6 h-6" />} color="white" /> :
            <ReactIcon src={<MdAdd className="w-6 h-6" />} color="white" />}
          <span>{(addEditPostMode) ? 'Back to posts' : 'Add new post'}</span>
        </Button>}

        {!addEditPostMode && <div className="flex space-x-4">
          <SortCriteria title="Reactions" onSort />
          <SortCriteria title="Publish date" onSort />
        </div>}

        {(addEditPostMode) ? <MultipleSelect value={blogTopics} onChange={(value) => { setBlogTopics(value) }}
          title="Topics" options={TOPICS_LIST} /> :
          <MultipleSelect value={filteringTopics} onChange={(value) => { setFilteringTopics(value) }}
            title="Topics" options={TOPICS_LIST} />}
      </header>

      {!addEditPostMode && <div className={allPostsClass}>
        {content}
      </div>}

      {!!addEditPostMode && <PostEditor topics={blogTopics} onUpdate={getAllPosts} />}

      {!addEditPostMode && <footer className="flex justify-around items-center w-full p-4">
        <p className="text-neutral-4">Number of posts: {userPosts.length}</p>
        <p className="text-neutral-4">Number of reactions: {reactions}</p>
      </footer>}
    </section>
  );
}

export default UserPosts;
