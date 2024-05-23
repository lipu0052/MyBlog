import React from 'react'
import {TextInput, Select,FileInput ,Button} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Post = () => {
  return (
    <>
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className='text-center text-3xl text-bold my-3'>Create Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <TextInput placeholder="Title" type='text' className='flex-1' required />
          <Select>
            <option >Select Catagory</option>
            <option value="javascript">javascript</option>
            
          </Select>
          
          
        </div>
        <div className="flex flex-col justify-between gap-4  border-2 border-green-500 sm:flex-row">
          <FileInput type="file" accept='image/*' />
          <Button outline type="button" size="sm" gradientDuoTone="purpleToBlue">Upload Image</Button>

        </div>
        <ReactQuill className=' h-32 mb-12' required theme="snow" placeholder='Write Your Post' />
        <Button type="submit" outline gradientDuoTone="purpleToBlue" className="w-full  h-10">
           Post
        </Button>
      </form>

      


    </div>
    </>
  )
}

export default Post