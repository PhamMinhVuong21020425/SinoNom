import { Collapse } from 'antd';
import FileList from './ImageList';
import FileListSetting from './ImageList/ImageListSetting';
import LabelList from './LabelList';
import LabelListSetting from './LabelList/LabelListSetting';
import { useStoreContext } from '../../contexts/StoreContext';
import { FileImageFilled } from '@ant-design/icons';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { Panel } = Collapse;

function RightToolbar() {
    const { state } = useStoreContext();
    const { imageFiles, selDrawImageIndex, shapes } = state;

    return (
        <Collapse bordered={false} start="left" defaultActiveKey={['file', 'label']}>
            <Panel
                key="file"
                header={
                    <span style={{ fontWeight: 'bolder' }}>
                        <FileImageFilled style={{ marginRight: '8px' }} />
                        {`Images (${imageFiles.length})`}
                    </span>
                }
                collapsible="header"
                extra={<FileListSetting />}
            >
                <FileList />
            </Panel>
            <Panel
                key="label"
                header={
                    selDrawImageIndex !== null ? (
                        <span style={{ fontWeight: 'bolder' }}>
                            <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px' }} />
                            {`Labels (${shapes[selDrawImageIndex].length})`}
                        </span>
                    ) : (
                        <span style={{ fontWeight: 'bolder' }}>
                            {' '}
                            <FontAwesomeIcon icon={faTag} style={{ marginRight: '8px' }} />
                            {'Label List (0)'}
                        </span>
                    )
                }
                collapsible="header"
                extra={<LabelListSetting />}
            >
                <LabelList />
            </Panel>
        </Collapse>
    );
}

export default RightToolbar;
