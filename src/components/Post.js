import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { BiSolidBookmark, BiSolidUser } from 'react-icons/bi';
import { openUserInfoPage, setAddEditPostMode, setCurrentPath, showNotification } from '../store';
import { auth, db } from '../firebase-config';
import MarkdownPreviewRef from '@uiw/react-markdown-preview';
import ReactIcon from './ReactIcon';

function Post({ post, onUpdate, onEdit, showUserData, editButtons }) {
  const dispatch = useDispatch();

  const editPost = () => {
    dispatch(setAddEditPostMode({
      addEditPostMode: 2,
      editablePostData: post
    }));
    onEdit(post.topics);
  }

  const deletePost = async () => {
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'posts', post.id));
      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'Post deleted'
      }));
      onUpdate();
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to delete post'
      }));
    }
  }

  const addReaction = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', post.id), {
        reactions: (post.reactions.indexOf(auth.currentUser.uid) === -1) ?
          arrayUnion(auth.currentUser.uid) :
          arrayRemove(auth.currentUser.uid)
      });
      onUpdate();
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to add reaction'
      }));
    }
  }

  const markPost = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'posts', post.id), {
        marked: (post.marked.indexOf(auth.currentUser.uid) === -1) ?
          arrayUnion(auth.currentUser.uid) :
          arrayRemove(auth.currentUser.uid)
      });
      onUpdate();
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to mark post'
      }));
    }
  }

  const openUserInfo = () => {
    if (auth.currentUser.uid === post.uid) {
      dispatch(setCurrentPath('/profile'));
    } else {
      dispatch(openUserInfoPage(post.userData));
    }
  }

  const formatDate = (date) => {
    const dateString = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return `${timeString} ${dateString}`
  }

  const topics = post.topics.map((topic) => <p className="ml-2 mb-2 px-4 py-1.5 text-lg bg-neutral-1 rounded-xl">{topic}</p>);

  return (
    <div className="flex flex-col space-y-2 p-4 bg-neutral-2 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        {showUserData && <div className="flex items-center space-x-4 cursor-pointer" onClick={openUserInfo}>
          {
            (post.userData.photoURL) ?
              <img className="w-16 h-16 rounded-full object-cover" src={post.userData.photoURL} alt="User logo" /> :
              <ReactIcon src={<BiSolidUser className="w-16 h-16" />} color="" />
          }
          <p className="text-2xl">{post.userData.name || 'Anonymous'}</p>
        </div>}

        <p>{formatDate(post.publishDate)}{post.editDate && ` (edited ${formatDate(post.editDate)})`}</p>

        {editButtons && <div className="flex space-x-2">
          <ReactIcon src={<MdEdit className="w-8 h-8 cursor-pointer duration-150 hover:opacity-75" onClick={editPost} />} color="#127be3" />
          <ReactIcon src={<MdDelete className="w-8 h-8 cursor-pointer duration-150 hover:opacity-75" onClick={deletePost} />} color="#e32e12" />
        </div>}
      </div>

      <p className="text-3xl font-bold">{post.header}</p>

      <MarkdownPreviewRef className="p-4" source={post.content} />

      <div className="flex justify-between items-end grow space-x-2">
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <ReactIcon src={<FaHeart className="w-6 h-6 cursor-pointer duration-150 hover:opacity-75 active:scale-125" onClick={addReaction} />}
              color={(post.reactions.includes(auth.currentUser?.uid) ? '#00A9BC' : '#73C67E')} />
            <p className="text-2xl">{post.reactions.length}</p>
          </div>

          {!editButtons && auth.currentUser.uid !== post.uid && (
            <div className="flex items-center space-x-2">
              <ReactIcon src={<BiSolidBookmark className="w-[1.6rem] h-[1.6rem] cursor-pointer duration-150 hover:opacity-75 active:scale-125" onClick={markPost} />}
                color={(post.marked.includes(auth.currentUser?.uid) ? '#00A9BC' : '#73C67E')} />
              <p className="text-2xl">{post.marked.length}</p>
            </div>)}
        </div>

        <p className="flex justify-end flex-wrap -mb-2">{topics}</p>
      </div>
    </div>
  );
}

export default Post;
