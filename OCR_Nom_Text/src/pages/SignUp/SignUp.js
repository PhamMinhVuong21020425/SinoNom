import { useEffect, useState } from 'react';
import Footer from '../ShareComponent/Footer/Footer';
import Header from '../ShareComponent/Header/Header';
import './SignUp.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleSignUpApi } from '../../components/Services/userServices';
import { loginSuccess } from '../../components/redux/authSlice';
import { FormattedMessage } from 'react-intl';
import Loading from '../ShareComponent/Loading/Loading';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [errMessage, setErrMessage] = useState([]);
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChecked = () => {
        setCheck(!check);
    };
    const handleOnchangeEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleOnchangePassword = (event) => {
        setPassword(event.target.value);
    };
    const handleOnchangeGender = (event) => {
        setGender(event.target.value);
    };
    const handleOnchangeName = (event) => {
        setName(event.target.value);
    };
    const handleOnchangePhone = (event) => {
        setPhone(event.target.value);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setErrMessage('');
        setLoading(true);
        try {
            let data = await handleSignUpApi(email, password, gender, name, phone);
            setTimeout(() => {
                setLoading(false);
                if (data && data.StatusCode !== 200) {
                    setErrMessage(data);
                }
                if (data && data.StatusCode === 200) {
                    dispatch(loginSuccess(data.Data));
                    navigate(-1);
                }
            }, 2000);
        } catch (e) {
            console.log(e);
            setTimeout(() => {
                if (e.response) {
                    if (e.response.data) {
                        setErrMessage(e.response.data.Message);
                    }
                }
            }, 2000);
        }
    };
    useEffect(() => {
        document.title = 'Đăng ký';
    });

    return (
        <div>
            <Header />
            <div className="signup-container">
                <div className="signup-content">
                    <div className="signup-inner">
                        <div className="side-bar">
                            <div className="title">
                                <FormattedMessage id="signup.reason" />
                            </div>
                            <div className="text">
                                <p>
                                    <FormattedMessage id="signup.reason-content" />
                                </p>
                            </div>
                            <ul className="list">
                                <li className="item">
                                    <FormattedMessage id="signup.item1" />
                                </li>
                                <li className="item">
                                    <FormattedMessage id="signup.item2" />
                                </li>
                                <li className="item">
                                    <FormattedMessage id="signup.item3" />
                                </li>
                            </ul>
                        </div>
                        <div className="main">
                            <div className="main-title">
                                <FormattedMessage id="signup.title" />
                            </div>
                            <div className="signup-form">
                                <div className="account-row">
                                    <div className="field">
                                        <label className="field-label">
                                            Email {''}
                                            <span className="force">*</span>
                                        </label>
                                        <input
                                            className="field-input"
                                            type="email"
                                            placeholder="example@email.com"
                                            onChange={(event) => handleOnchangeEmail(event)}
                                            required
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="field-label">
                                            <FormattedMessage id="signup.password" /> {''}
                                            <span className="force">*</span>
                                        </label>
                                        <input
                                            className="field-input"
                                            type="password"
                                            placeholder="123@@@"
                                            onChange={(event) => handleOnchangePassword(event)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="gender">
                                    <div className="field">
                                        <label className="field-label">
                                            <FormattedMessage id="signup.gender" /> {''}
                                            <span className="force">*</span>
                                        </label>
                                        <div className="checkbox">
                                            <div className="form-check">
                                                <input
                                                    className="check-input"
                                                    type="radio"
                                                    value="1"
                                                    checked={check}
                                                    onClick={check ? (e) => e.stopPropagation() : handleChecked}
                                                    onChange={(event) => handleOnchangeGender(event)}
                                                />
                                                <label className="name-gender">
                                                    <FormattedMessage id="signup.male" />
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="check-input"
                                                    type="radio"
                                                    value="0"
                                                    checked={!check}
                                                    onClick={!check ? (e) => e.stopPropagation() : handleChecked}
                                                    onChange={(event) => handleOnchangeGender(event)}
                                                />
                                                <label className="name-gender">
                                                    <FormattedMessage id="signup.female" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-account">
                                    <div className="field">
                                        <label className="field-label">
                                            <FormattedMessage id="signup.fullname" /> {''}
                                            <span className="force">*</span>
                                        </label>
                                        <input
                                            className="field-input"
                                            type="text"
                                            placeholder="UET-VNU"
                                            onChange={(event) => handleOnchangeName(event)}
                                            required
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="field-label">
                                            <FormattedMessage id="signup.phone" /> {''}
                                            <span className="force">*</span>
                                        </label>
                                        <input
                                            className="field-input"
                                            type="phone"
                                            placeholder="03825543512"
                                            onChange={(event) => handleOnchangePhone(event)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="license">
                                    <div className="license-check">
                                        <input className="license-input" type="checkbox" checked />
                                        <label className="license-label">
                                            <FormattedMessage id="signup.policy" /> {''}
                                            <a
                                                className="link-license"
                                                target="blank"
                                                href="https://vn.joboko.com/chinh-sach-bao-mat"
                                            >
                                                <FormattedMessage id="signup.policy-private" />
                                            </a>
                                            <FormattedMessage id="signup.annotation" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="sign-up-button">
                                <button
                                    className="button-content"
                                    type="submit"
                                    onClick={() => {
                                        handleSignUp();
                                    }}
                                >
                                    <span className="button-title">
                                        <FormattedMessage id="homeheader.signup" />
                                    </span>
                                </button>
                                <div className="link-content">
                                    <div className="exist-account">
                                        <FormattedMessage id="signup.haveaccount" />
                                    </div>
                                    <a className="login-link" href="/login">
                                        <FormattedMessage id="homeheader.login" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {loading && (
                <div className="loading-animation">
                    <Loading />
                </div>
            )}
        </div>
    );
}

export default SignUp;
