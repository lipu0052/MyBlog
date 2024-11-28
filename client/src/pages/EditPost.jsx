import React, { useState, useEffect } from 'react';
import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';

const EditPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ });
    const [file, setFile] = useState(null);
    const [imgUploadingProgress, setImgUploadingProgress] = useState(null);
    const [imgUploadingError, setImgUploadingError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3001/posts?postId=${postId}`, {
                    credentials: 'include', // This sends cookies with the request for authentication
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                }
                const data = await response.json();
                setFormData(data.posts[0]);
                console.log(data.posts[0]);
            } catch (error) {
                console.error("Error fetching post data:", error);
                setUpdateError('Failed to fetch post data.');
            }
        };
        fetchPost();
    }, [postId]);

    const handleUploadImg = async () => {
        if (!file) {
            setImgUploadingError('Please provide a file');
            return;
        }
        try {
            const storage = getStorage(app);
            const fileName = `${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImgUploadingProgress(progress.toFixed(0));
                },
                (error) => {
                    setImgUploadingError('Failed to upload image');
                    setImgUploadingProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFormData((prevData) => ({ ...prevData, image: downloadURL }));
                        setImgUploadingProgress(null);
                        setImgUploadingError(null);
                    });
                }
            );
        } catch (error) {
            console.error(error);
            setImgUploadingError('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const sanitizedContent = sanitizeHtml(formData.content);
            const response = await fetch(`http://localhost:3001/editPost/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
                body: JSON.stringify({ ...formData, content: sanitizedContent }),
            });

            if (response.ok) {
                setUpdateSuccess('Post updated successfully');
                setTimeout(() => navigate('/dashboard'), 3000);
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error("Error updating post:", error);
            setUpdateError('Failed to update post');
        }
    };

    return (
        <div className="min-h-screen p-3 max-w-3xl mx-auto">
            <h1 className='text-center text-3xl font-bold my-3'>Edit Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <TextInput
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Title"
                        required
                    />
                    <Select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="uncategorized">Select Category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="react">React</option>
                    </Select>
                </div>
                <div className="flex flex-col justify-between gap-4 border-2 border-green-500 sm:flex-row">
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button outline type="button" size="sm"
                        gradientDuoTone="purpleToBlue"
                        onClick={handleUploadImg}
                        disabled={!!imgUploadingProgress}
                    >
                        {imgUploadingProgress ? (
                            <div className="h-6 w-6">
                                <CircularProgressbar value={imgUploadingProgress} text={`${imgUploadingProgress || 0}%`} />
                            </div>
                        ) : (
                            "Update Image"
                        )}
                    </Button>
                </div>
                {imgUploadingError && <Alert color="failure">{imgUploadingError}</Alert>}
                {formData.image && <img src={formData.image} alt="upload preview" className="h-72 w-full object-cover" />}
                
                <ReactQuill
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    theme="snow"
                    placeholder="Edit your post content"
                    className='h-52 mb-12'
                    required
                />
                <Button type="submit" outline gradientDuoTone="purpleToBlue" className="w-full mt-5 h-10">
                    Update Post
                </Button>
                {updateSuccess && <Alert className="mt-5" color="success">{updateSuccess}</Alert>}
                {updateError && <Alert className="mt-5" color="failure">{updateError}</Alert>}
            </form>
        </div>
    );
};

export default EditPost;
