import React, { useEffect, useState } from "react";
import { getFilesRoute, downloadRoute, deleteRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import { Flip, toast } from "react-toastify";
import axios from "axios";
import download from "../assets/download.png";
import trash from "../assets/trash.png";
import "react-toastify/dist/ReactToastify.css";
import "../css/Files.css";

export default function Files({ files, setFiles }) {
    const [showContent, setShowContent] = useState(false);
    const toastId = React.useRef(null);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        transition: Flip,
        theme: "colored",
        hideProgressBar: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: false,
        closeButton: false,
    };
    useEffect(() => {
        async function fetchData() {
            const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
            try {
                const { data } = await axios.post(`${getFilesRoute}`, { _id: user._id });
                if (data.status === true) {
                    setFiles(data.files);
                    setShowContent(true);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []); // eslint-disable-line
    const downloadFile = async (fileId) => {
        const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
        try {
            const res = await axios.post(`${downloadRoute}`, { _id: user._id, fileId: fileId }, { responseType: "blob" });
            const contentDisposition = res.headers['content-disposition'];
            const fileName = contentDisposition.split('"')[1];
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.log(err);
        }
    }
    const deleteFile = async (fileId) => {
        const user = await JSON.parse(localStorage.getItem(process.env.MONGODRIVE_APP_LOCALHOST_KEY));
        try {
            const { data } = await axios.post(`${deleteRoute}`, { _id: user._id, fileId: fileId });
            if (data.status === true) {
                if (!toast.isActive(toastId.current))
                    toastId.current = toast.success("File Deleted", toastOptions);
                try {
                    const { data } = await axios.post(`${getFilesRoute}`, { _id: user._id });
                    if (data.status === true) {
                        setFiles(data.files);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            {(showContent) ?
                <>
                    {
                        (files.length) ?
                            <>
                                <div className="fileHeader">
                                    <p className="name">Name</p>
                                    <p className="uploadedOn">Uploaded On</p>
                                    <p className="fileSize">File Size</p>
                                </div>
                                <div className="fileContainer">
                                    {files.map((file) => {
                                        return (
                                            <div key={uuidv4()} className="file">
                                                <div className="title">{file.fileName}</div>
                                                <div className="uploadedDate">{file.uploadedOn}</div>
                                                <div className="size">{
                                                    (file.fileSize < 1000) ? `${file.fileSize} Bytes`
                                                        : (file.fileSize < 1000000) ? `${Math.round((file.fileSize * 0.001) * 100) / 100} KB`
                                                            : (file.fileSize < 1000000000) ? `${Math.round(((Math.round((file.fileSize * 0.001) * 100) / 100) * 0.001) * 100) / 100} MB`
                                                                : `${Math.round(((Math.round(((Math.round((file.fileSize * 0.001) * 100) / 100) * 0.001) * 100) / 100) * 0.001) * 100) / 100} GB`
                                                }</div>
                                                <div className="actions">
                                                    <button onClick={() => downloadFile(file.fileId)} className="download" title="Download"><img src={download} alt="download" /></button>
                                                    <button onClick={() => {
                                                        if (!toast.isActive(toastId.current)) {
                                                            toastId.current = toast.warning(
                                                                <div className="cancel-delete-options">
                                                                    <div className="cancel-delete-options-title">
                                                                        Delete {file.fileName} ?
                                                                    </div>
                                                                    <div>
                                                                        <button className="cancel">Cancel</button>
                                                                        <button className="delete" onClick={() => deleteFile(file.fileId)}>Delete</button>
                                                                    </div>
                                                                </div>
                                                                ,
                                                                toastOptions);
                                                        }
                                                    }} className="trash" title="Delete"><img src={trash} alt="delete" /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                            :
                            <div className="noFiles">
                                No Files to Show
                            </div>
                    }
                </>
                :
                <></>
            }
        </>
    )
}
