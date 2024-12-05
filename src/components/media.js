import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaExpandAlt, FaUpload } from 'react-icons/fa';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import ShowNotification from './snackbar';
import { SnackbarContext } from '../context/snackbarContext';

const MediaList = () => {
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [media, setMedia] = useState([]);
    console.log('media: ', media);
    const [expandedMedia, setExpandedMedia] = useState(null);
    const [currentTab, setCurrentTab] = useState('all');
    const authToken = localStorage.getItem('authToken');
    const { setIsVisible, setShowNotification } = useContext(SnackbarContext);

    // get all media
    const getMedia = async () => {
        const response = await axios.get('http://localhost:5000/api/users/media', {
            headers: {
                Authorization: `${authToken}`,
            },
        });
        if (response.status === 200) {
            setMedia(response?.data?.data);
        } else {
            ShowNotification({
                status: "error",
                message: response?.data?.Message
            })
        }
    };

    // delete single or multi media
    const deleteMedia = async (url) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this media?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.put(
                    'http://localhost:5000/api/users/remove',
                    { image: selectedMedia },
                    { headers: { Authorization: `${authToken}` } }
                );
                if (response?.status === 200) {
                    getMedia();
                    Swal.fire('Deleted!', 'The media has been deleted.', 'success');
                }
                setShowNotification({ status: 'Info', message: 'Media has been deleted successfully' });
                setIsVisible(true);
            }
        });
    };

    const openLargeView = (mediaUrl, isVideo) => {
        setExpandedMedia({ mediaUrl, isVideo });
    };

    const closeLargeView = () => {
        setExpandedMedia(null);
    };

    const isVideo = (url) => {
        return url?.endsWith('.mp4');
    };

    // media upload
    const handleFileUpload = async (e) => {
        const files = e.target.files;

        const allowedExtensions = ['gif', 'jpeg', 'jpg', 'png', 'mp4'];
        const formData = new FormData();

        Array.from(files).forEach((file) => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (allowedExtensions.includes(fileExtension)) {
                formData.append('files', file);
            } else {
                Swal.fire('Error', `File type not allowed: ${file.name}`, 'error');
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/users/upload', formData, {
                headers: {
                    Authorization: authToken,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                getMedia();
                setShowNotification({ status: 'Info', message: 'Media has been uploaded successfully' });
                setIsVisible(true);
            }
        } catch (error) {
            console.log('Upload error:', error);
            Swal.fire('Error', 'File upload failed!', 'error');
        }
    };

    // select media for delete
    const handleCheckboxChange = (media) => {
        setSelectedMedia((prevSelected) =>
            prevSelected.includes(media)
                ? prevSelected.filter((selected) => selected !== media)
                : [...prevSelected, media]
        );
    };

    // filter media
    const filteredMedia = media.filter((data) => {
        if (currentTab === 'photos') {
            return !isVideo(data?.media);
        } else if (currentTab === 'videos') {
            return isVideo(data?.media)
        }
        return true;
    });

    useEffect(() => {
        getMedia();
    }, []);

    return (
        <>
            <div className="flex items-center justify-center py-4 flex-wrap my-3 gap-5">
                <div className="relative">
                    <input
                        type="file"
                        onChange={(e) => handleFileUpload(e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/gif, image/jpeg, image/jpg, image/png, video/mp4"
                        multiple
                    />
                    <button
                        type="button"
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-lg font-medium focus:outline-none"
                    >
                        <FaUpload className="mr-2" /> Upload Media
                    </button>
                </div>
                <button
                    type="button"
                    className="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-full text-base font-medium px-5 py-2.5 text-center"
                    onClick={() => {
                        console.log("Deleting selected media:", selectedMedia);
                        selectedMedia.forEach((index) => deleteMedia(media[index]?.media));
                        setSelectedMedia([]);
                    }}
                    disabled={!selectedMedia.length}
                >
                    Delete Selected Media
                </button>
            </div>

            {/* Tabs for filtering media */}
            <div className="flex justify-center mb-5">
                <button
                    onClick={() => setCurrentTab('all')}
                    className={`px-4 py-2 mx-2 text-white ${currentTab === 'all' ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                    All Media
                </button>
                <button
                    onClick={() => setCurrentTab('photos')}
                    className={`px-4 py-2 mx-2 text-white ${currentTab === 'photos' ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                    Photos
                </button>
                <button
                    onClick={() => setCurrentTab('videos')}
                    className={`px-4 py-2 mx-2 text-white ${currentTab === 'videos' ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                    Videos
                </button>
            </div>

            {/* Media Display */}
            <div className="container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((data) => (
                    <div key={data?.id} className="relative group cursor-pointer">
                        <input
                            type="checkbox"
                            className="absolute top-2 left-2 w-5 h-5"
                            checked={selectedMedia.includes(data?.media)}
                            onChange={() => handleCheckboxChange(data?.media)}
                        />
                        {isVideo(data?.media) ? (
                            <Player>
                                <source src={data?.media} />
                            </Player>
                        ) : (
                            <img
                                className={`h-full max-w-full rounded-lg ${selectedMedia.includes(data?.id) ? 'opacity-50' : ''
                                    }`}
                                src={data?.media}
                                alt={`Media ${data?.id}`}
                                onClick={() => openLargeView(data?.media, false)}
                            />
                        )}
                        {!isVideo(data?.media) && (
                            <div className="absolute bottom-2 right-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openLargeView(data?.media);
                                    }}
                                    className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-2"
                                >
                                    <FaExpandAlt />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Expanded View for Media */}
            {expandedMedia && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeLargeView}
                >
                    <div className="relative">
                        {expandedMedia.isVideo ? (
                            <Player>
                                <source src={expandedMedia.mediaUrl} />
                            </Player>
                        ) : (
                            <>
                                <img src={expandedMedia.mediaUrl} alt="Expanded view" className="max-w-[300px] max-h-full" />
                                <button
                                    onClick={closeLargeView}
                                    className="absolute top-5 right-5 text-white text-3xl"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MediaList;
