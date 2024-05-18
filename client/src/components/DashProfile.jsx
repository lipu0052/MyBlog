import React, { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TextInput, Button, Alert, Modal } from 'flowbite-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { HiEye, HiEyeOff } from 'react-icons/hi';


const DashProfile = ({ user }) => {
  const navigate = useNavigate();
  const refClick = React.useRef();
  const [formData, setFormData] = useState({});
  const [isProfileImgClicked, setIsProfileImgClicked] = useState(false); // State to track if profile image is clicked
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [imgUploadingProgress, setImgUploadingProgress] = useState(null);
  const [imgUploadingError, setImgUploadingError] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [updatingSuccess, setUpdatingSuccess] = useState(null);
  const [updatingError, setUpdatingError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  


  const logoutFunction = async () => {
    try {
      const response = await fetch('https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',

        },
        credentials: 'include',
      });


      if (response.status === 200) {
        navigate('/signup');

      }

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgUrl(URL.createObjectURL(file));
    }



  };

  useEffect(() => {
    if (imgFile) {
      uploadImage();
    }
  }, [imgFile]);


  const uploadImage = async () => {
    setImgUploadingError(null);
    setImgUploading(true);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imgFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imgFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImgUrl(null)
        setImgUploadingProgress(null);
        setImgUploading(false);
        setImgUploadingError("could not upload(file must be less than 2MB)");

      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUploadingProgress(null);
          setImgUrl(downloadURL);
          setImgUploading(false);
          setFormData({ ...formData, profileImg: downloadURL });
        })
      }
    )



  }
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdatingSuccess(null)
    setUpdatingError(null)
    const updatedFormData = { ...formData };
  if (!updatedFormData.password) {
    updatedFormData.password = ''; // Set password to empty string if not provided
  }
    if (Object.keys(formData).length === 0) {
      setUpdatingError("No changes were made")
      return;
    }
    if (imgUploading) {
      setUpdatingError("Please wait while the image is being uploaded");
      return;
    }
    try {
      const res = await fetch(`https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/updateProfile/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedFormData)
      });

      const data = await res.json();
      if (res.status === 200) {
        setUpdatingSuccess("Successfully updated");
        setTimeout(() =>{
          setUpdatingSuccess(null)
        },5000)

      } else {
        setUpdatingError(data.message);
      }
    } catch (err) {
      console.error(err);
      setUpdatingError(data.message);
      // Handle error
    }
  }
  const deleteAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://3001-lipu0052-myblog-41hg32rb1tg.ws-us110.gitpod.io/deleteAccount/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
      });

      const data = await res.json();
      if (res.status === 200) {
        navigate('/');
      } 
    } catch (err) {
      console.error(err);
      window.alert(data.message);
    }

  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center text-2xl font-semibold my-3">PROFILE</h1>
      <form className="flex gap-3 flex-col" onSubmit={handleSubmit} >
        <input type="file" onChange={handleImageChange} accept="image/*" ref={refClick} hidden />

        {/* Profile image section */}
        <div
          className=" w-40 h-40 flex items-center self-center relative justify-center rounded-full overflow-hidden cursor-pointer "
          onClick={() => setIsProfileImgClicked(!isProfileImgClicked)}
        >
          {imgUploadingProgress && (
            <CircularProgressbar
              value={imgUploadingProgress || 0}
              text={`${imgUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,

                },
                path: {
                  stroke: `rgba(52,155,253,${imgUploadingProgress / 100})`
                }
              }}
            />
          )}
          <img
            src={imgUrl || user.profileImg}
            alt="profile"
            className={`object-cover absolute rounded-full border-8  w-full h-full ${imgUploadingProgress && imgUploadingProgress < 100 && 'opacity-60'}`}
          />

        </div>


        {/* If profile image is clicked and button is open, show the input file to change the profile image */}
        {isProfileImgClicked && (
          <div className="flex flex-col items-center mt-1">
            <Button onClick={() => refClick.current.click()} gradientDuoTone="greenToBlue" outline>
              Change Profile Picture
            </Button>
          </div>
        )}

        {
          imgUploadingError && <Alert color="failure">{imgUploadingError}</Alert>


        }

        <TextInput
          label="Name"
          id='name'
          defaultValue={user.name} onChange={handleChange}
        />
        <TextInput label="Email" id='email' defaultValue={user.email} onChange={handleChange} />
        <div className="relative">
          <TextInput
            type={showPassword ? 'text' : 'password'}
            label="Password"
            id="password"
            placeholder="password"
            onChange={handleChange}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </div>
        </div>

        {/* ... */}
        <Button type="submit" gradientDuoTone="greenToBlue" outline className="w-full">
          Update
        </Button>
      </form>
      <div className="mt-2 flex justify-between">
        <span className="text-sm cursor-pointer text-red-600" onClick={() => setShowModal(true)}>Delete Account</span>
        <span className="text-sm cursor-pointer text-red-600" onClick={logoutFunction}>Logout</span>
      </div>
      {
        updatingSuccess && <Alert color="success" className="m-2">{updatingSuccess}</Alert>
      }
      {
        updatingError && <Alert color="failure" className='m-2'>{updatingError}</Alert>
      }

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle  className="h-14 w-14 text-gray-700 mx-auto mb-2 dark:text-grey-200"/> 
            <h1 className="text-xl font-semibold">Are you sure you want to delete your account?</h1>
            <div className="
            flex justify-between h-8 mt-2">
              <Button  color='failure' outline  onClick={deleteAccount}>Yes</Button>
              <Button color="success"  outline onClick={() => setShowModal(false)}>No</Button>
            </div>
          </div>

        </Modal.Body>


      </Modal>

    </div>
  );
};

export default DashProfile; 