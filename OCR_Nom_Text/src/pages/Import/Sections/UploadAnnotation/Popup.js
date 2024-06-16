import { Modal, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { isUploadTrue } from '../../../../components/redux/eventSlice';
import { useDispatch, useSelector } from 'react-redux';
import './Popup.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Upload } from 'antd';
import { handleCreateModel } from '../../../../components/Services/userServices';
import { message } from 'antd';
const { Dragger } = Upload;

function PopupAnnotations(props) {
    const { name, description } = props;
    const dispatch = useDispatch();
    const check = useSelector((state) => state.eventSlice.isUploadModal);
    const [format, setFormat] = useState('');
    const [content, setContent] = useState('');

    const userRedux = JSON.parse(localStorage.getItem('persist:user'));
    let userId = JSON.parse(userRedux.authSlice).user.userId;

    const onCancel = () => {
        dispatch(isUploadTrue(false));
    };
    const handleSelectFile = (info) => {
        let file = info.file.originFileObj;
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.addEventListener(
            'load',
            function () {
                // convert file to base64 string using reader.result
                setContent(reader.result.toString());
            },
            false,
        );

        if (file) {
            reader.readAsDataURL(file);
        }

        // reader.onload = function (event) {
        //     // event.target.result chứa nội dung của tệp dưới dạng ArrayBuffer
        //     let fileContent = event.target.result;

        //     // Chuyển đổi ArrayBuffer thành chuỗi base64
        //     let base64String = btoa(String.fromCharCode(...new Uint8Array(fileContent)));

        //     // Sử dụng base64String theo nhu cầu của bạn, ví dụ: gửi đến máy chủ
        //     console.log(base64String);
        //     //setContent(base64String.toString());
        // };

        // reader.readAsArrayBuffer(file);
    };
    const handleOkUpload = async () => {
        if (format === '') {
            alert('Vui lòng chọn định dạng!');
            return;
        }
        if (content === '') {
            alert('Vui lòng tải lên dữ liệu!');
            return;
        }
        let data = await handleCreateModel(userId, name, '', description, content, format);

        dispatch(isUploadTrue(false));
        dispatch(isUploadTrue('loading'));
        message.success('Đã thực hiện thành công!');
        setContent('');
        dispatch(isUploadTrue(false));
    };

    return (
        <Modal
            className="modal-content"
            title={
                <div className="modal-header" style={{ width: '100%', cursor: 'move' }}>
                    Import annotation
                </div>
            }
            open={check}
            onCancel={onCancel}
            onOk={handleOkUpload}
        >
            <div className="modal-body">
                <div className="import-format">
                    <div className="title">
                        Import format <span className="force">*</span>
                    </div>
                    <div className="select-format">
                        <Select
                            className="select-tag"
                            placeholder="Select annotation format"
                            optionFilterProp="children"
                            onChange={(value) => setFormat(value)}
                            options={[
                                {
                                    value: 'coco',

                                    label: (
                                        <>
                                            <FontAwesomeIcon
                                                style={{ paddingRight: '8px', color: '#1890ff' }}
                                                icon={faArrowUpFromBracket}
                                            />
                                            COCO
                                        </>
                                    ),
                                },
                                {
                                    value: 'yolo',
                                    label: (
                                        <>
                                            <FontAwesomeIcon
                                                style={{ paddingRight: '8px', color: '#1890ff' }}
                                                icon={faArrowUpFromBracket}
                                            />
                                            YOLO
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
                <div className="import-file">
                    <Dragger maxCount={1} type="file" onChange={(value) => handleSelectFile(value)}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Dragger>
                </div>
            </div>
        </Modal>
    );
}

export default PopupAnnotations;
