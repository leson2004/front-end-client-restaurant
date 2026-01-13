import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';
import './uploadImage.css'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../Config/Client/Firebase';

const ImageUploadComponent = ({ id, onImageUpload }) => {
    const [pictures, setPictures] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const onDrop = (pictureFiles) => {
        const file = pictureFiles[0];
        if (!file) return;

        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Theo dõi tiến trình tải lên
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // Xử lý lỗi
                console.error('Upload failed:', error);
                setUploading(false);
            },
            () => {
                // Xử lý thành công
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setPictures([downloadURL]);
                    onImageUpload([downloadURL]); // Gọi callback để truyền URL lên component cha
                    setUploading(false);
                    setUploadProgress(0); // Đặt lại tiến trình
                });
            }
        );
    };

    return (
        <div>
            <ImageUploader
                withIcon={true}
                buttonText='Chọn ảnh'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
                maxFileSize={5242880}
                withPreview={true}
                singleImage={true}
                fileContainerStyle={{ backgroundColor: '#f8f9fa' }} // Áp dụng style tùy chỉnh
                id={id}
            />
            {uploading && (
                <div className='float-end'>
                    <p>Đang tải lên: {Math.round(uploadProgress)}%</p>
                    <progress value={uploadProgress} max="100" />
                </div>
            )}
        </div>
    );
};


export default ImageUploadComponent;
