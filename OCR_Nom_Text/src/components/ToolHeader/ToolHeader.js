import './ToolHeader.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function ToolHeader() {
    const userRedux = JSON.parse(localStorage.getItem('persist:user'));
    let userData = JSON.parse(userRedux.authSlice).user;
    const navigate = useNavigate();
    const handleGoHome = () => {
        if (window.confirm('Chắc chắn thoát? Dữ liệu có thể không được lưu!')) {
            navigate('/import');
        } else {
            return;
        }
    };

    return (
        <div className="tool-header-container">
            <div className="left-header">
                <div className="title">Hanomize</div>
                <div className="link-home" onClick={handleGoHome}>
                    Home
                </div>
                <a className="link">Projects</a>
                <a className="link">Tasks</a>
                <a className="link">Models</a>
            </div>
            <div className="right-header">
                <button className="model-name">Default model</button>
                {userData ? (
                    <div className="user-info">
                        <div>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="name">{userData.fullName}</div>
                    </div>
                ) : (
                    <div className="user-info">
                        <FontAwesomeIcon icon={faUser} />
                        <a className="login-link" href="/login">
                            Login
                        </a>
                    </div>
                )}
                {/* <a className="exit" href="/import">
                    Thoát
                </a> */}
            </div>
        </div>
    );
}

export default ToolHeader;
