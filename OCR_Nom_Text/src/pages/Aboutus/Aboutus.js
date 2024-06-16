import { useEffect } from 'react';
import Footer from '../ShareComponent/Footer/Footer';
import Header from '../ShareComponent/Header/Header';
import './Aboutus.scss';

function AboutUs() {
    useEffect(() => {
        document.title = 'Về chúng tôi';
    });
    return (
        <div>
            <Header />
            <div className="container">
                <div className="aboutus-content">
                    <div className="aboutus-header">Công cụ nhận diện chữ Hán - Nôm</div>
                    <div className="context">
                        <div className="left-context">
                            <div className="text">
                                Tiếng nói là khả năng bẩm sinh của con người, còn chữ viết là biểu thị cho nền văn minh
                                của một đất nước, một phát minh sáng tạo của một dân tộc. Tiếng Việt diệu kì với ngữ âm
                                cực kỳ phong phú cùng hệ thống chữ viết giàu mạnh nhất vùng Đông Á. Xuyên suốt chiều dài
                                lịch sử, chữ viết nước ta đã trải qua hành trình từ chữ Hán hay chữ Nho đến chữ Nôm và
                                cuối cùng là chữ Quốc Ngữ dựa trên hệ thống chữ Latin và đi cùng với mỗi loại chữ ấy là
                                một trang sử vẻ vang đáng ôn lại của dân tộc.
                            </div>
                            <div className="text">
                                Sau khi Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng năm 938, kết thúc nghìn năm
                                Bắc thuộc, ông cha ta với ý thức tự chủ ngôn ngữ, đã sáng tạo ra chữ Nôm dựa trên cơ sở
                                chữ Hán được đọc theo âm Hán-Việt, nên có thể nói chữ Hán là một tập con của chữ Nôm. Và
                                trong hơn 1000 năm sau đó, từ thế kỷ 10 đến thế kỷ 20, song song với việc dùng chữ Hán,
                                chữ Nôm được dùng để ghi lại phần lớn các tài liệu văn học, y học, triết học, tôn giáo,
                                lịch sử văn hóa dân tộc. Tuy nhiên, di sản này hiện tại có nguy cơ tiêu vong bởi sự
                                chuyển dịch sang loại chữ viết hiện đại hơn - chữ Quốc Ngữ.
                            </div>
                            <div className="text">
                                Theo Hội Bảo tồn di sản chữ Nôm Việt Nam (Vietnamese Nôm Preservation Foundation - VNPF)
                                thì: “Ngày nay, trên thế giới chưa có đến 100 người đọc được chữ Nôm. Một phần to tát
                                của lịch sử Việt Nam như thế nằm ngoài tầm tay của 80 triệu người nói tiếng Việt”. Do
                                giá trị to lớn của các tài liệu lịch sử đối với việc nghiên cứu, đặc biệt là các khía
                                cạnh xã hội và lối sống thời trước cùng với những thông điệp mà cha ông để lại, việc bảo
                                tồn di sản văn hóa này là cấp thiết
                            </div>
                        </div>
                        <div className="right-context">
                            <img
                                className="image"
                                src="https://cdn0.fahasa.com/media/catalog/product/z/2/z2470841796407_6e7ec53bafe59fd1c2d2114193a36799.jpg"
                            />
                        </div>
                    </div>
                    <div className="reason">
                        <div className="top-reason">
                            <div>
                                <i>Dân ta phải biết sử ta</i>
                            </div>
                            <div>
                                <i>Cho tường gốc tích nước nhà Việt Nam</i>
                            </div>
                            <div className="reference"> (Trích “Việt Nam Quốc Sử Diễn Ca”, Hồ Chí Minh)</div>
                        </div>
                        <div className="bot-reason">
                            <div>
                                Lịch sử Việt Nam là lịch sử có chiều rộng, lại có chiều sâu, vì vậy Việt Nam không chỉ
                                xanh hoa tốt lá mà còn mập gốc chắc rễ. Nền độc lập của cổ Việt đã được hoàn thành trong
                                êm đẹp của thời bình nên nước Việt Nam chẳng khác gì một quả chín rụng ra khỏi cây mẹ để
                                tự sống một cuộc đời riêng, mang đầy đủ sinh lực trong chính mình. Khi một cây đã mang
                                đầy đủ sinh lực trong chính mình và đã có gốc mập rễ sâu thì một cành có thể bị gãy và
                                rạn nứt, thân cây có thể bị đốn nhưng cây không sao chết được. Từ gốc nó, người ta sẽ
                                thấy mầm nảy lên và cây sống lại.
                            </div>
                            <div>
                                Với tình yêu cho những trang sử vẻ vang của dân tộc cùng khát khao cho cội nguồn hào
                                hùng đó được tiếp tục duy trì và trở nên gần gũi hơn tới từng người Việt, chúng tôi đã
                                xây dựng công cụ này một cách đầy tâm huyết cùng với niềm tự hào trên từng dòng chữ viết
                                được và đó cũng như là một cách chúng tôi tỏ lòng mình với công lao của cha ông ngày
                                trước.
                            </div>
                        </div>
                    </div>
                    <div className="goal">
                        <div className="left-goal">
                            <img src="logo.png" width={'200px'} height={'200px'} />
                        </div>
                        <div className="right-goal">
                            <div>
                                Chúng tôi tập trung nghiên cứu vào quy trình xây dựng một bộ dữ liệu tốt, các kỹ thuật
                                xử lý ảnh, xử lý ngôn ngữ tự nhiên, và các phương pháp học sâu để giải quyết 2 bài toán:
                                phát hiện và nhận dạng các ký tự Hán-Nôm trong các văn bản lịch sử, tác phẩm văn học.
                                Đồng thời xây dựng ứng dụng Web cùng bộ công cụ thao tác với các nhãn/bộ dữ liệu.
                            </div>
                        </div>
                    </div>
                    <a className="aboutus-review">Đánh giá - Báo lỗi</a>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUs;
