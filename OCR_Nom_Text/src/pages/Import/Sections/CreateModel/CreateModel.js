import { useDispatch, useSelector } from 'react-redux';
import PopupAnnotations from '../UploadAnnotation/Popup';
import './CreateModel.scss';
import { FormattedMessage } from 'react-intl';
import { isUploadTrue } from '../../../../components/redux/eventSlice';
import { useEffect, useState } from 'react';

function CreateModel() {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const check = useSelector((state) => state.eventSlice.isUploadModal);
    const handleClickUpload = () => {
        if (!name) {
            alert('Vui lòng nhập tên Mô hình');
            return;
        }
        if (!description) {
            alert('Vui lòng nhập mô tả Mô hình');
            return;
        }
        dispatch(isUploadTrue(true));
    };
    const handleOnchangeName = (event) => {
        setName(event.target.value);
    };
    const handleOnchangeDescription = (event) => {
        setDescription(event.target.value);
    };

    useEffect(() => {
        if (check === 'loading') {
            setName('');
            setDescription('');
        }
    });

    return (
        <div className="create-container">
            <div className="create-header">
                <FormattedMessage id="create.title" />
            </div>
            <div className="create-content">
                <div className="import-box">
                    <div className="upload-box" onClick={handleClickUpload}>
                        <div className="upload-title">
                            <FormattedMessage id="import.upload" />
                        </div>
                    </div>
                    <PopupAnnotations name={name} description={description} />
                    <div className="model-info">
                        <div className="model-name">
                            <div className="header">
                                <FormattedMessage id="create.enter" />
                                <span className="force">*</span>
                            </div>
                            <input
                                className="name-button"
                                type="text"
                                value={name}
                                onChange={(event) => handleOnchangeName(event)}
                                placeholder="example_model"
                            ></input>
                        </div>
                        {/* <div className="model-button">
                            <button type="submit" className="button">
                                <span className="button-text">
                                    <FormattedMessage id="create.send" />
                                </span>
                            </button>
                        </div> */}
                        <div className="model-name" style={{ paddingTop: '15px' }}>
                            <div className="header">
                                Mô tả: <span className="force">*</span>
                            </div>

                            <textarea
                                className="name-button"
                                type="text"
                                value={description}
                                spellCheck="false"
                                placeholder="Mô hình sử dụng COCO format"
                                style={{ height: '100px' }}
                                onChange={(event) => handleOnchangeDescription(event)}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateModel;
