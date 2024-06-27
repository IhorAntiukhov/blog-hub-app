import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { nanoid } from '@reduxjs/toolkit';
import { BiSolidBookmark, BiSolidUser } from 'react-icons/bi';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import { openUserInfoPage, setAddEditPostMode, setCurrentPath, showNotification } from '../../store';
import { auth, db } from '../../firebase-config';
import MarkdownPreviewRef from '@uiw/react-markdown-preview';
import ReactIcon from '../other/ReactIcon';
import classNames from 'classnames';

function Post({ arrayName, onToggleReaction, onTogglePostMark, onEdit, post, showUserData, editButtons }) {
  const [showFullContent, setShowFullContent] = useState(0);
  const dispatch = useDispatch();

  const postContentRef = useRef();

  useEffect(() => {
    if (postContentRef) {
      if (postContentRef.current.getBoundingClientRect().height > 500) {
        setShowFullContent(1);
      }
    }
  }, [postContentRef]);

  const editPost = () => {
    dispatch(setAddEditPostMode({
      addEditPostMode: 2, editablePostData: post
    }));
    onEdit(post.topics);
  }

  const deletePost = () => {
    const notificationId = nanoid();

    dispatch(showNotification({
      id: notificationId, type: 'Confirm', text: 'Delete post?', post
    }));
  }

  const addReaction = async () => {
    if (!auth.currentUser) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Log in to leave reactions'
      }));

      return;
    }

    try {
      const addReaction = !post.reactions.includes(auth.currentUser.uid);

      await updateDoc(doc(db, 'users', post.uid, 'posts', post.id), {
        reactions: (addReaction) ?
          arrayUnion(auth.currentUser.uid) :
          arrayRemove(auth.currentUser.uid)
      });

      dispatch(onToggleReaction({ arrayName, id: post.id, addReaction, uid: auth.currentUser.uid }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to add reaction'
      }));
    }
  }

  const markPost = async () => {
    if (!auth.currentUser) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Log in to mark posts'
      }));

      return;
    }

    if (editButtons || auth.currentUser.uid === post.uid) return;

    try {
      const markPost = post.marked.indexOf(auth.currentUser.uid) === -1;

      await updateDoc(doc(db, 'users', post.uid, 'posts', post.id), {
        marked: (markPost) ?
          arrayUnion(auth.currentUser.uid) :
          arrayRemove(auth.currentUser.uid)
      });

      dispatch(onTogglePostMark({ arrayName, id: post.id, markPost, uid: auth.currentUser.uid }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to mark post'
      }));
    }
  }

  const openUserInfo = () => {
    if (auth.currentUser?.uid === post.uid) {
      dispatch(setCurrentPath('/profile'));
    } else if (post.userData) {
      dispatch(openUserInfoPage(post.userData));
    }
  }

  const formatDate = (date) => {
    const newDate = new Date(date);
    const dateString = `${String(newDate.getDate()).padStart(2, '0')}.${String(newDate.getMonth() + 1).padStart(2, '0')}.${newDate.getFullYear()}`;
    const timeString = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;

    return `${timeString} ${dateString}`
  }

  const topics = post.topics.map((topic) => (
    <p key={topic} className="ml-2 mb-2 px-4 py-1.5 text-lg bg-neutral-1 rounded-xl">{topic}</p>
  ));

  const markPostIcon = classNames('w-[1.6rem]', 'h-[1.6rem]',
    { 'cursor-pointer duration-150 hover:opacity-75 active:scale-125': !(editButtons || auth.currentUser?.uid === post.uid) });

  return (
    <div className="flex flex-col space-y-2 p-4 bg-neutral-2 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-2">
        {showUserData && <div className="flex items-center space-x-4 cursor-pointer" onClick={openUserInfo}>
          {(post.userData?.photoURL) ?
            <img className="w-16 h-16 rounded-full object-cover" src={post.userData.photoURL} alt="User logo" /> :
            <ReactIcon src={<BiSolidUser className="w-16 h-16" />} color="" />}
          <p className="text-2xl">{post.userData?.name || 'Anonymous'}</p>
        </div>}

        <p className="break-words">{formatDate(post.publishDate)}{post.editDate && ` (edited ${formatDate(post.editDate)})`}</p>

        {editButtons && <div className="flex space-x-2">
          <ReactIcon src={<MdEdit className="w-8 h-8 cursor-pointer duration-150 hover:opacity-75" onClick={editPost} />} color="#127be3" />
          <ReactIcon src={<MdDelete className="w-8 h-8 cursor-pointer duration-150 hover:opacity-75" onClick={deletePost} />} color="#e32e12" />
        </div>}
      </div>

      <p className="text-2xl font-bold">{post.header}</p>

      <div ref={postContentRef} className="relative overflow-hidden" style={(showFullContent === 1) ? { 'height': '500px' } : {}}>
        <MarkdownPreviewRef className="p-4" source={post.content} />

        {showFullContent === 1 &&
          <div className="absolute z-10 top-[420px] flex justify-center w-full bg-gradient-to-t from-[white] pt-12 pb-1">
            <p className="text-lg text-neutral-4 cursor-pointer" onClick={() => { setShowFullContent(2) }}>Read more ...</p>
          </div>}
        {showFullContent === 2 &&
          <div className="flex justify-center w-full p-1 bg-[white]">
            <p className="text-lg text-neutral-4 cursor-pointer" onClick={() => { setShowFullContent(1) }}>Hide content</p>
          </div>}
      </div>

      <div className="flex justify-between items-end grow space-x-2">
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <ReactIcon src={<FaHeart className="w-6 h-6 cursor-pointer duration-150 hover:opacity-75 active:scale-125" onClick={addReaction} />}
              color={(post.reactions.includes(auth.currentUser?.uid) ? '#00A9BC' : '#73C67E')} />
            <p className="text-2xl">{post.reactions.length}</p>
          </div>

          <div className="flex items-center space-x-2">
            <ReactIcon src={<BiSolidBookmark className={markPostIcon} onClick={markPost} />}
              color={(post.marked.includes(auth.currentUser?.uid) ? '#00A9BC' : '#73C67E')} />
            <p className="text-2xl">{post.marked.length}</p>
          </div>
        </div>

        <p className="flex justify-end flex-wrap -mb-2">{topics}</p>
      </div>
    </div>
  );
}

export default Post;
