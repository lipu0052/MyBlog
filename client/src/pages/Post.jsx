import React, { useState } from 'react'
import { TextInput, Select, FileInput, Button , Alert } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';



const Post = () => {

  const [file, setFile] = useState(null)
  const [imgUploadingProgress, setImgUploadingProgress] = useState(null)
  const [imgUploadingError, setImgUploadingError] = useState(null)
  const [formData, setFormData] = useState({})
  const handleUploadImg = async () => {
    try {
      if (!file) {
        setImgUploadingError('Please provide a file')
        return
      }
      setImgUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() +'_'+ file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImgUploadingError('Failed to upload')
          setImgUploadingProgress(null);

        }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUploadingProgress(null);
            setImgUploadingError(null);
            setFormData({ ...formData, img: downloadURL });

          })
        })
    } catch (error) {
     setImgUploadingProgress(null);
      setImgUploadingError('Failed to upload')
      console.log(error)
    }
  }

  return (
    <>
      <div className="min-h-screen p-3 max-w-3xl mx-auto">
        <h1 className='text-center text-3xl text-bold my-3'>Create Post</h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <TextInput placeholder="Title" type='text' className='flex-1' required />
            <Select>
              <option value="uncategorized" >Select Catagory</option>
              <option value="javascript">javascript</option>
              <option value="react">react</option>

            </Select>


          </div>
          <div className="flex flex-col justify-between gap-4  border-2 border-green-500 sm:flex-row">
            <FileInput type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
            <Button outline type="button" size="sm" disabled={imgUploadingProgress} gradientDuoTone="purpleToBlue" onClick={handleUploadImg}>
              {
              imgUploadingProgress ? <div className="h-6 w-6">
                <CircularProgressbar value={imgUploadingProgress} text={`${imgUploadingProgress || 0}%`} />
              </div>:
              ("Upload img")
            }
            </Button>

          </div>
          {imgUploadingError && <Alert color="failure">{imgUploadingError}</Alert> }
          {formData.img && <img src={formData.img} alt='upload' className='h-72 w-full object-cover'/> }

          <div>
            <ReactQuill className=' h-32 mb-12' required theme="snow" placeholder='Write Your Post' />

          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue" className="w-full mt-5   h-10">
            Post
          </Button>
        </form>




      </div>
    </>
  )
}

export default Post