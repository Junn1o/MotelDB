import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { detailTier } from '../../api/api';
import { image } from '../../constants/URL'
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
function TruncatedText({ text, maxLength }) {
    if (text.length <= maxLength) {
        return (
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {text}
            </td>
        );
    } else {
        const truncatedText = text.slice(0, maxLength) + "...";
        return (
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {truncatedText}
            </td>
        );
    }
}
const DetailsTier = () => {
    const { id } = useParams();
    const [tierData, setTierData] = useState(null);
    const {logout,loginContext} = useContext(UserContext);
    useEffect(() => {
        const fetchTierDetails = async () => {
            try {
                const response = await detailTier(id);
                // Lưu thông tin người dùng vào state
                setTierData(response.data);
                const path =localStorage.setItem('path',window.location.pathname);
                const userid = localStorage.getItem('userid');
                const token = localStorage.getItem('token');
                const firstname = localStorage.getItem('firstname');
                const lastname = localStorage.getItem('lastname');
                const role = localStorage.getItem('role');
                const avatar = localStorage.getItem('avatar');
                loginContext(token,userid,firstname,lastname,role,avatar,path)
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
            
        };

        // Gọi hàm để lấy chi tiết người dùng khi component được tạo ra
        fetchTierDetails();
    }, [id]); // Chạy lại useEffect khi id thay đổi
    //   const calculateElapsedTime = (post) => {
    //     if (post && post.datecreatedroom) {
    //       const postDate = moment(post.datecreatedroom);
    //       const currentDate = moment();

    //       const hoursDiff = currentDate.diff(postDate, 'hours');
    //       const minutesDiff = currentDate.diff(postDate, 'minutes') % 60;
    //       const dateDiff = currentDate.diff(postDate, 'hours') % 24 ;
    //       if (hoursDiff >= 24) {
    //         // Nếu thời gian trôi qua lớn hơn hoặc bằng 24 giờ, hiển thị ngày đăng
    //         return `${dateDiff} ngày trước`;
    //         // return postDate.format('DD/MM/YYYY');
    //       } else if (hoursDiff > 0) {
    //         // Nếu thời gian trôi qua dưới 24 giờ, hiển thị số giờ và phút trước đó
    //         return `${hoursDiff} giờ ${minutesDiff} phút trước`;
    //       } else {
    //         // Nếu thời gian trôi qua dưới 1 giờ, chỉ hiển thị số phút trước đó
    //         return `${minutesDiff} phút trước`;
    //       }
    //     }

    //     return 'Không xác định';
    //   };
    //   const getImageUrl = (actualFile) => {
    //     // Check if actualFile is not null before splitting
    //     if (actualFile && typeof actualFile === 'string') {
    //       // Xử lý actualFile để đảm bảo định dạng đúng
    //       const cleanedUrl = actualFile.split(';')[0];
    //       return `https://localhost:7139/${cleanedUrl}`;
    //     } else {
    //       // Handle the case where actualFile is null or not a string
    //       console.error("Invalid actualFile:", actualFile);
    //       return ""; // or return a default image URL
    //     }
    //   };

    return (
        <div>
            <Link to='/tier'> Trở về</Link>
            {tierData ? (
                <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-6">Chi tiết Gói</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Tên:</p>
                            <p className="font-semibold">{tierData.tiername}</p>
                        </div>


                    </div>
                    <div style={{ width: '98%', height: '5px', backgroundColor: 'black' }} className="my-6 mx-auto"></div>
                    <h2>Tin đã đăng</h2>
                    <div>
                        {tierData.listUsers && tierData.listUsers.length > 0 ? (
                             <table>
                             <thead>

                                 <th>ID</th>
                                 <th>Tên</th>
                                 <th>Ngày Sinh</th>
                                 <th>Địa chỉ</th>
                                 <th>Giới tính</th>
                                 <th>Số Điện Thoại</th>
                             </thead>
                                            <tbody>
                                            {tierData.listUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td><span>{user.id}</span></td>
                                                    <td>
                                                        <div>
                                                            {user.actualFile && (<img
                                                                src={`${image}/${user.actualFile}`}
                                                                className="dashboard-content-avatar "
                                                                alt="not found"
                                                            />)}
                                                            <span>{user.firstname + " " + user.lastname}</span>
                                                        </div>
                                                    </td>
                                                    <td><span>{user.birthday}</span></td>
                                                    <td><span>{user.address}</span></td>
                                                    <td><span>{user.gender ? "Nam" : "Nữ"}</span></td>
                                                    <td><span>{user.phone}</span></td>
                                                    <td><span>{user.rolename}</span></td>
                                                </tr>
                                                ))}
                                            </tbody>                           
                            </table>
                        ) : (
                            <p>No users available for this user.</p>
                        )}
                    </div>
                </div>

            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
};

export default DetailsTier;
