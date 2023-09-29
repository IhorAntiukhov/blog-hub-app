import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { getDocs, collectionGroup, query, where, or, and } from 'firebase/firestore';
import { BiSolidSearchAlt2 } from 'react-icons/bi';
import classNames from 'classnames';
import { setAllPosts, setSearchTerm, showNotification, togglePostMark, toggleReactionToPost } from '../store';
import { db } from '../firebase-config';
import useSortPosts from '../hooks/use-sort-posts';
import TopPanel from '../components/other/TopPanel';
import Post from '../components/posts/Post';
import Input from '../components/input/Input';
import TOPICS_LIST from '..';

function HomePage() {
  const { allPosts, searchTerm } = useSelector((state) => state.allPostsReducer);
  const dispatch = useDispatch();

  const getAllPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs((searchTerm) ?
        query(collectionGroup(db, 'posts'),
          or(and(where('header', '>=', searchTerm), where('header', '<=', searchTerm + '\uf8ff')), where('header', '==', ''))) :
        collectionGroup(db, 'posts'));

      const postsData = [];
      const usersData = {};

      querySnapshot.forEach((doc) => {
        if (doc.id === 'userData') {
          const creationTime = doc.data().creationTime.toDate();
          usersData[doc.data().uid] = { ...doc.data(), creationTime: creationTime.getTime() };
        }
      });

      querySnapshot.forEach((doc) => {
        if (doc.id !== 'userData') {
          const publishDate = doc.data().publishDate.toDate();
          const editDate = (doc.data().editDate) ? doc.data().editDate.toDate() : '';

          postsData.push({
            ...doc.data(), id: doc.id, userData: usersData[doc.data().uid],
            publishDate: publishDate.getTime(), editDate: (editDate) ? editDate.getTime() : ''
          });
        }
      });

      dispatch(setAllPosts(postsData));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'An error occurred while trying to retrieve posts'
      }));
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const sortedPosts = useSortPosts(TOPICS_LIST, 'allPosts');

  let content;
  if (allPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4 text-center">
      {(searchTerm) ? 'There are no posts matching your search term' : 'No posts published'}
    </p>;
  } else if (allPosts.length > 0 && sortedPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4 text-center">There are no posts matching your criteria</p>;
  } else {
    content = sortedPosts.map((post) =>
    (<Post key={post.id} onToggleReaction={toggleReactionToPost} onTogglePostMark={togglePostMark}
      post={post} showUserData />
    ));
  }

  const postsClass = classNames({
    'grid grid-cols-[repeat(auto-fit,_minmax(440px,_1fr))] gap-4 pr-4 overflow-auto': sortedPosts.length > 0,
    'flex justify-center items-center h-full': sortedPosts.length === 0
  });

  return (
    <div className="flex flex-col space-y-6 h-full p-6 sm:overflow-auto">
      <div className="inline-grid grid-cols-[1fr] grid-rows-[repeat(2,_auto)] self-center gap-4">
        <Input className="w-full" value={searchTerm} onChange={(text) => { dispatch(setSearchTerm(text)) }}
          type="text" placeholder="Search posts" icon={<BiSolidSearchAlt2 className="h-8 w-8" />} />
        <TopPanel />
      </div>

      <div className={postsClass}>
        {content}
      </div>
    </div>
  );
}

export default HomePage;
