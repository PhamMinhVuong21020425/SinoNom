import Footer from '../ShareComponent/Footer/Footer';
import Header from '../ShareComponent/Header/Header';
import './ForgotPass.scss';
function ForgotPass() {
    return (
        <div>
            <Header />
            <div className="wrapper">
                <div className="container">
                    <div className="forgot-content">
                        <div className="top-content">
                            <span>Quên mật khẩu</span>
                        </div>
                        <div className="bot-content">
                            <div className="top-form">
                                <label className="form-label">Nhập email đăng ký tài khoản của bạn:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập Email của bạn"
                                    required=""
                                ></input>
                            </div>
                            <div className="bot-form">
                                <button className="btn-form">Nhận email xác thực</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ForgotPass;
