import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MdPreview, MdClear, MdArrowBack, MdPublish } from 'react-icons/md';
import { showNotification } from '../store';
import { db, storage, auth } from '../firebase-config';
import MarkdownPreviewRef from '@uiw/react-markdown-preview';
import Button from './Button';
import Input from './Input';
import ReactIcon from './ReactIcon';

function PostEditor({ topics }) {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const dispatch = useDispatch();

  const publishPost = async () => {
    try {
      const userRef = ref(ref(storage), auth.currentUser.uid);
      const postContentRef = ref(userRef, (new Date()).getTime() + '.txt');
      const postContentFile = new Blob([postContent], { type: 'text/plain' });

      await uploadBytes(postContentRef, postContentFile);
      const downloadURL = await getDownloadURL(postContentRef);

      await addDoc(collection(db, auth.currentUser.uid), {
        header: postTitle,
        contentURL: downloadURL,
        topics: topics.join(' '),
        publishDate: new Date(),
        editDate: ''
      });

      dispatch(showNotification({
        id: nanoid(), type: 'Info', text: 'Post successfully published'
      }));
    } catch (error) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Failed to publish post'
      }));
    }
  }

  const openPreviewMode = () => {
    if (!postTitle || !postContent) {
      dispatch(showNotification({
        id: nanoid(), type: 'Error', text: 'Enter the title and content of the post'
      }));

      return;
    }

    setPreviewMode(!previewMode);
  }

  const handleInput = (text) => {
    setPostContent(text);
  }

  return (
    <div className="flex flex-col space-y-4 grow w-full p-6 border-b-2 border-neutral-3">
      {(previewMode) ?
        <MarkdownPreviewRef className="grow border-b-2 border-neutral-3" source={postContent} /> :
        <>
          <Input value={postTitle} onChange={(text) => { setPostTitle(text) }} type="text" placeholder="Post title" largeFont />
          <textarea className="grow p-4 text-xl border-[3px] border-neutral-3 rounded-lg focus:outline-none"
            placeholder="Enter Markdown text ..." value={postContent} onInput={(event) => { handleInput(event.target.value) }} />
        </>}

      <div className="flex justify-end space-x-4">
        <Button onClick={openPreviewMode} secondary>
          {(previewMode) ?
            <ReactIcon src={<MdArrowBack className="w-6 h-6" />} color="black" /> :
            <ReactIcon src={<MdPreview className="w-6 h-6" />} color="black" />}
          <span className="text-[black]">{(previewMode) ? 'Back to editing' : 'Preview'}</span>
        </Button>

        {(previewMode) ?
          <Button onClick={publishPost}>
            <ReactIcon src={<MdPublish className="w-6 h-6" />} color="white" />
            <span>Publish post</span>
          </Button> :
          <Button onClick={() => { setPostContent('') }} error>
            <ReactIcon src={<MdClear className="w-6 h-6" />} color="white" />
            <span>Clear</span>
          </Button>}
      </div>
    </div>
  );
}

export default PostEditor;
