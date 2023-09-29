import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { getDocs, collection, query, collectionGroup, where, or } from 'firebase/firestore';
import { MdAdd, MdArrowBack } from 'react-icons/md';
import classNames from 'classnames';
import { setUserPosts, setAddEditPostMode, showNotification, toggleReactionToUserPost, toggleUserPostMark } from '../../store';
import { auth, db } from '../../firebase-config';
import useSortPosts from '../../hooks/use-sort-posts';
import Button from '../other/Button';
import ReactIcon from '../other/ReactIcon';
import MultipleSelect from '../input/MultipleSelect';
import SortCriteria from './SortCriteria';
import PostEditor from './PostEditor';
import Post from './Post';
import TOPICS_LIST from '../..';

function UserPosts({ arrayName }) {
  const { userPosts, reactions, addEditPostMode } = useSelector((state) => state.userPostsReducer);
  const userData = useSelector((state) => state.navigationReducer.userData);

  const dispatch = useDispatch();

  const [filteringTopics, setFilteringTopics] = useState(TOPICS_LIST);
  const [blogTopics, setBlogTopics] = useState([]);

  const getAllPosts = useCallback(async () => {
    try {
      let querySnapshot = [];
      const usersData = {};

      if (arrayName === 'subscriptions') {
        if (!auth.currentUser) {
          dispatch(showNotification({
            id: nanoid(), type: 'Error', text: 'You are not logged in'
          }));

          return;
        }

        const subscriptionsQuerySnapshot = await getDocs(query(collectionGroup(db, 'posts'), where('subscribers', 'array-contains', auth.currentUser.uid)));
        if (!subscriptionsQuerySnapshot.empty) {
          const subscribedUsers = [];
          subscriptionsQuerySnapshot.forEach((doc) => {
            const creationTime = doc.data().creationTime.toDate();

            usersData[doc.data().uid] = { ...doc.data(), creationTime: creationTime.getTime() };
            subscribedUsers.push((doc.data().uid));
          });

          querySnapshot = await getDocs(query(collectionGroup(db, 'posts'), where('uid', 'in', subscribedUsers)));
        }
      }
      else if (arrayName === 'marked') {
        if (!auth.currentUser) {
          dispatch(showNotification({
            id: nanoid(), type: 'Error', text: 'You are not logged in'
          }));

          return;
        }

        querySnapshot = await getDocs(query(collectionGroup(db, 'posts'), or(where('marked', 'array-contains', auth.currentUser.uid), where('marked', '==', ''))));

        querySnapshot.forEach((doc) => {
          if (doc.id === 'userData') {
            const creationTime = doc.data().creationTime.toDate();
            usersData[doc.data().uid] = { ...doc.data(), creationTime: creationTime.getTime() };
          }
        });
      }
      else {
        querySnapshot = await getDocs(collection(db, 'users', (arrayName === 'ownPosts') ? auth.currentUser.uid : userData.uid, 'posts'));
      }

      const postsData = [];
      let subscribers = 0;
      let subscriptions = 0;

      querySnapshot.forEach((doc) => {
        if (doc.id !== 'userData') {
          const publishDate = doc.data().publishDate.toDate();
          const editDate = (doc.data().editDate) ? doc.data().editDate.toDate() : '';

          postsData.push({
            ...doc.data(), id: doc.id, userData: usersData[doc.data().uid],
            publishDate: publishDate.getTime(), editDate: (editDate) ? editDate.getTime() : ''
          });
        } else if (arrayName === 'ownPosts') {
          subscribers = doc.data().subscribers.length;
          subscriptions = doc.data().subscriptions.length;
        }
      });
      dispatch(setUserPosts({ arrayName, postsData, userData: { subscribers, subscriptions } }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'An error occurred while trying to retrieve posts'
      }));
    }
  }, [dispatch, userData, arrayName]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleSetPostMode = () => {
    dispatch(setAddEditPostMode({
      addEditPostMode: (addEditPostMode !== 0) ? 0 : 1
    }));
  }

  const sortedPosts = useSortPosts(filteringTopics, arrayName);

  let content;
  if (userPosts[arrayName].length === 0) {
    let noPostsText;
    switch (arrayName) {
      case 'ownPosts':
        noPostsText = 'You haven\'t published any posts';
        break;
      case 'subscriptions':
        noPostsText = 'You haven\'t followed any user';
        break;
      case 'marked':
        noPostsText = 'You haven\'t marked any posts';
        break;
      default:
        noPostsText = 'The user hasn\'t published any posts';
        break;
    }
    content = <p className="text-2xl text-center text-neutral-4">{noPostsText}</p>;
  } else if (userPosts[arrayName].length > 0 && sortedPosts.length === 0) {
    content = <p className="text-2xl text-center text-neutral-4">There are no posts on established topics</p>;
  } else {
    content = sortedPosts.map((post) =>
    (<Post key={post.id} arrayName={arrayName} onToggleReaction={toggleReactionToUserPost}
      onTogglePostMark={toggleUserPostMark} onEdit={(topics) => { setBlogTopics(topics) }} post={post}
      editButtons={arrayName === 'ownPosts'} showUserData={arrayName === 'subscriptions' || arrayName === 'marked'} />));

    content = (arrayName === 'subscriptions' || arrayName === 'marked') ?
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">{content}</div> :
      content;
  }

  const headerClass = classNames('flex', 'justify-between', 'items-center',
    'space-x-2', 'w-full', 'p-6', 'border-b-2', 'border-neutral-3',
    { 'xl:flex-wrap xl:space-y-2 md:flex-wrap md:space-y-2': arrayName === 'ownPosts' },
    'xs:flex-col xs:gap-2');

  const postsClass = classNames({ 'flex justify-center items-center': sortedPosts.length === 0 },
    'grow', 'space-y-4', 'w-full', 'p-6', 'overflow-auto', 'border-b-2', 'border-neutral-3');

  return (
    <section className="flex flex-col items-center grow bg-[white] rounded-xl shadow-lg">
      <header className={headerClass}>
        {arrayName === 'ownPosts' &&
          <Button className="xl:order-1 md:order-1" onClick={handleSetPostMode}>
            {(addEditPostMode) ?
              <ReactIcon src={<MdArrowBack className="w-6 h-6" />} color="white" /> :
              <ReactIcon src={<MdAdd className="w-6 h-6" />} color="white" />}
            <span>{(addEditPostMode) ? 'Back to posts' : 'Add new post'}</span>
          </Button>}

        {!addEditPostMode &&
          <div className="flex space-x-4 xl:order-3 xl:self-center xl:justify-center xl:w-full md:order-3 md:self-center md:justify-center md:w-full">
            <SortCriteria title="Reactions" onSort />
            <SortCriteria title="Publish date" onSort />
          </div>}

        {(addEditPostMode) ?
          <div className="xl:order-2 md:order-2"><MultipleSelect value={blogTopics} onChange={(value) => { setBlogTopics(value) }}
            title="Topics" options={TOPICS_LIST} /></div> :
          <div className="xl:order-2 md:order-2"><MultipleSelect value={filteringTopics} onChange={(value) => { setFilteringTopics(value) }}
            title="Topics" options={TOPICS_LIST} /></div>}
      </header>

      {!addEditPostMode &&
        <div className={postsClass}>
          {content}
        </div>}

      {!!addEditPostMode && <PostEditor topics={blogTopics} />}

      {!addEditPostMode &&
        <footer className="flex justify-around items-center w-full p-4">
          <p className="text-neutral-4">Number of posts: {userPosts[arrayName].length}</p>
          <p className="text-neutral-4">Number of reactions: {reactions}</p>
        </footer>}
    </section>
  );
}

export default UserPosts;
