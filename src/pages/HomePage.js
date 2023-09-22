import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { getDocs, collectionGroup } from 'firebase/firestore';
import { setAllPosts, showNotification } from '../store';
import { db } from '../firebase-config';
import TopPanel from '../components/TopPanel';
import Post from '../components/Post';
import useSortPosts from '../hooks/use-sort-posts';
import TOPICS_LIST from '..';
import classNames from 'classnames';

function HomePage() {
  const { allPosts } = useSelector((state) => state.allPostsReducer);
  const dispatch = useDispatch();

  const getAllPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collectionGroup(db, 'posts'));

      const postsData = [];
      const usersData = {};

      querySnapshot.forEach((doc) => {
        if (doc.id === 'userData') {
          usersData[doc.data().uid] = { ...doc.data() }
        }
      });

      querySnapshot.forEach((doc) => {
        if (doc.id !== 'userData') {
          postsData.push({
            ...doc.data(), id: doc.id, userData: usersData[doc.data().uid],
            publishDate: doc.data().publishDate.toDate(),
            editDate: (doc.data().editDate !== '') ? doc.data().editDate.toDate() : ''
          });
        }
      });

      dispatch(setAllPosts(postsData));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'An error occurred while trying to retrieve posts'
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const sortedPosts = useSortPosts(TOPICS_LIST, 'allPosts');

  let content;
  if (allPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4">No posts published</p>;
  } else if (allPosts.length > 0 && sortedPosts.length === 0) {
    content = <p className="text-2xl text-neutral-4">There are no posts matching your criteria</p>;
  } else {
    content = sortedPosts.map((post) =>
    (<Post key={post.id} post={post} showUserData />
    ));
  }

  const postsClass = classNames({
    'grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4': sortedPosts.length > 0,
    'flex justify-center items-center h-full': sortedPosts.length === 0
  });

  return (
    <div className="flex flex-col space-y-6 h-full p-6">
      <TopPanel />

      <div className={postsClass}>
        {content}
      </div>
    </div>
  );
}

export default HomePage;
