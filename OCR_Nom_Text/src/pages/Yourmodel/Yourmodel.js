import { useEffect, useMemo, useState } from 'react';
import Footer from '../ShareComponent/Footer/Footer';
import Header from '../ShareComponent/Header/Header';
import './Yourmodel.scss';
import Pagination from './Pagtination';
import { getAllModelById } from '../../components/Services/userServices';
import Loading from '../ShareComponent/Loading/Loading';
import { useDispatch } from 'react-redux';
import { isOpenDescript } from '../../components/redux/eventSlice';
import DescriptionModal from './descriptionModal';

let PageSize = 10;

function Yourmodel() {
    const [currentPage, setCurrentPage] = useState(1);
    const [list, setList] = useState({ Data: [] });
    const [isLoad, setIsLoad] = useState(false);
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();

    const userRedux = JSON.parse(localStorage.getItem('persist:user'));
    let userData = JSON.parse(userRedux.authSlice).user;
    let userId = '';
    if (userData) {
        userId = userData.userId;
    }

    const handleShowDescription = (event) => {
        setDescription(event);
        dispatch(isOpenDescript(true));
    };

    useEffect(async () => {
        document.title = 'Danh sách mô hình';
        if (userData) {
            setIsLoad(true);
            let data = await getAllModelById(userId);
            if (data === null) {
                return;
            }
            setList(data);
            setTimeout(() => {
                setIsLoad(false);
            }, 1000);
        }
    }, []);

    const currentTableData = useMemo(() => {
        if (list.Data === null) return [];
        if (isLoad) return [];
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return list.Data.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, isLoad]);

    return (
        <div>
            <Header />
            {isLoad && (
                <div className="loading-animation">
                    <Loading />
                </div>
            )}
            <div className="yourmodel-container">
                <div className="yourmodel-content">
                    <div className="yourmodel-title">Danh sách mô hình</div>
                    {userData && list.Data !== null ? (
                        <div className="yourmodel-table">
                            <div className="section">
                                <div className="filter">
                                    <div className="filter-form">
                                        <div className="col1">
                                            <input className="form-control" type="text" placeholder="Từ khóa" />
                                        </div>
                                        <div className="col1">
                                            <select className="form-select" type="text" placeholder="Trạng thái">
                                                <option value="0" selected>
                                                    Trạng thái
                                                </option>
                                                <option value="1">Chờ xử lý</option>
                                                <option value="2">Đã duyệt</option>
                                                <option value="3">Bị từ chối</option>
                                            </select>
                                        </div>
                                        <div className="col1">
                                            <button className="search-button" type="submit">
                                                Tìm kiếm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-content">
                                    <div className="top-content">
                                        <div className="table-header">
                                            <div className="row">
                                                <div className="row-data">#</div>
                                                <div className="row-data1">Ngày tạo</div>
                                                <div className="row-data1">Tên mô hình</div>
                                                <div className="row-data1">Trạng thái</div>
                                                <div className="row-data1">Thông tin</div>
                                            </div>
                                        </div>
                                        <div className="table-body">
                                            {currentTableData.map((item, index) => {
                                                return (
                                                    <div className="body-row">
                                                        <div className="body-row-data">
                                                            <span>{index + 1}</span>
                                                        </div>
                                                        <div className="body-row-data1">
                                                            <span>{item.Date}</span>
                                                        </div>

                                                        <div className="body-row-data1">
                                                            <span>{item.Name}</span>
                                                        </div>

                                                        <div className="body-row-data1">
                                                            <span>{item.Status}</span>
                                                        </div>
                                                        <div
                                                            className="body-button"
                                                            onClick={() => handleShowDescription(item.Description)}
                                                        >
                                                            <a className="infor-link" h role="button">
                                                                Mô tả
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <DescriptionModal description={description} />
                                        </div>
                                        <div className="pagination-container">
                                            <Pagination
                                                className="pagination-bar"
                                                currentPage={currentPage}
                                                totalCount={list.Data !== null ? list.Data.length : 0}
                                                pageSize={PageSize}
                                                onPageChange={(page) => setCurrentPage(page)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="notuser">
                            Bạn chưa có mô hình nào!{' '}
                            <a href="/import" className="create-model">
                                Tạo mô hình
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Yourmodel;
