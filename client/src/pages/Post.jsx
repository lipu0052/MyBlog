import React, { useState } from 'react';
import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'
import sanitizeHtml from 'sanitize-html'; 

const Post = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imgUploadingProgress, setImgUploadingProgress] = useState(null);
  const [imgUploadingError, setImgUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(formData)
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);

  const handleUploadImg = async () => {
    try {
      if (!file) {
        setImgUploadingError('Please provide a file');
        return;
      }
      setImgUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '_' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImgUploadingError('Failed to upload');
          setImgUploadingProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUploadingProgress(null);
            setImgUploadingError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImgUploadingProgress(null);
      setImgUploadingError('Failed to upload');
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedContent = sanitizeHtml(formData.content, {
        allowedTags: [], // No allowed tags, strip everything
        allowedAttributes: {} // No allowed attributes, strip everything
      });

      const res = await fetch("http://localhost:3001/post", {
        method: "POST",
        body: JSON.stringify({ ...formData, content: sanitizedContent }),
        headers: {
          "Content-Type": "application/json",
          Accept: 'application/json'
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.status === 201) {
        setPublishSuccess(data.message);
        setTimeout(() => {
          navigate('/dashboard?tab=profile')

        }, 3000)

      }
      else {
        setPublishSuccess(null);
        setPublishError(data.message);
        return;
      }
    } catch (err) {
      setPublishSuccess(null)
      console.log(err);
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className='text-center text-3xl text-bold my-3'>Create Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <TextInput placeholder="Title" type='text' onChange={(e) => setFormData({ ...formData, title: e.target.value })} className='flex-1' required />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="uncategorized" key="uncategorized">Select Category</option>
            <option value="javascript" key="javascript">JavaScript</option>
            <option value="react" key="react">React</option>
          </Select>
        </div>
        <div className="flex flex-col justify-between gap-4 border-2 border-green-500 sm:flex-row">
          <FileInput type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
          <Button outline type="button" size="sm" disabled={!!imgUploadingProgress} gradientDuoTone="purpleToBlue" onClick={handleUploadImg}>
            {imgUploadingProgress ? (
              <div className="h-6 w-6">
                <CircularProgressbar value={imgUploadingProgress} text={`${imgUploadingProgress || 0}%`} />
              </div>
            ) : (
              "Upload img"
            )}
          </Button>
        </div>
        {imgUploadingError && <Alert color="failure">{imgUploadingError}</Alert>}
        {formData.image && <img src={formData.image} alt='upload' className='h-72 w-full object-cover' />}
        <div>
          <ReactQuill onChange={(value) => setFormData({ ...formData, content: value })} className='h-52 mb-12' required theme="snow" placeholder='Write Your Post' />
        </div>
        <Button type="submit" outline gradientDuoTone="purpleToBlue" className="w-full mt-5 h-10">
          Post
        </Button>
        {publishSuccess && <Alert className="mt-5" color="success">{publishSuccess}</Alert>}

        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
};

export default Post;
