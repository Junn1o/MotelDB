import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { detailUser } from '../../api/api';
import moment from 'moment';
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
const DetailsUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const {logout,loginContext} = useContext(UserContext);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await detailUser(id);
        // Lưu thông tin người dùng vào state
        setUserData(response.data);
        const path =localStorage.setItem('path',window.location.pathname);
                const token = localStorage.getItem('token');
                const userid = localStorage.getItem('userid');
                const firstname = localStorage.getItem('firstname');
                const lastname = localStorage.getItem('lastname');
                const role = localStorage.getItem('role');
                const avatar = localStorage.getItem('avatar');
                loginContext(token,userid,firstname,lastname,role,avatar,path)
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [id]);
             
  const calculateElapsedTime = (posts) => {
    if (posts && posts.dateCreated) {
      const postDate = moment(posts.dateCreated);
      const currentDate = moment();

      const hoursDiff = currentDate.diff(postDate, 'hours');
      const minutesDiff = currentDate.diff(postDate, 'minutes') % 60;
      const dateDiff = currentDate.diff(postDate, 'hours') % 24 ;
      if (hoursDiff >= 24) {
        // Nếu thời gian trôi qua lớn hơn hoặc bằng 24 giờ, hiển thị ngày đăng
        return `${dateDiff} ngày trước`;
        // return postDate.format('DD/MM/YYYY');
      } else if (hoursDiff > 0) {
        // Nếu thời gian trôi qua dưới 24 giờ, hiển thị số giờ và phút trước đó
        return `${hoursDiff} giờ ${minutesDiff} phút trước`;
      } else {
        // Nếu thời gian trôi qua dưới 1 giờ, chỉ hiển thị số phút trước đó
        return `${minutesDiff} phút trước`;
      }
    }
    
    return 'Không xác định';
  };
  const _getImageUrl = (actualFile) => {
    // Check if actualFile is not null before splitting
    if (actualFile && typeof actualFile === 'string') {
      // Xử lý actualFile để đảm bảo định dạng đúng
      const cleanedUrl = actualFile.split(';')[0];
      return `${image}/${cleanedUrl}`;
    } else {
      // Handle the case where actualFile is null or not a string
      console.error("Invalid actualFile:", actualFile);
      return ""; // or return a default image URL
    }
  };
  
  return (
    <div>
      <Link to = '/users'> Trở về</Link>
      {userData ? (
        <div className="max-w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6">Chi tiết người dùng</h2>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Tên:</p>
            <p className="font-semibold">{userData.fullname}</p>
          </div>
  
          <div>
            <p className="text-gray-600">Địa chỉ:</p>
            <p className="font-semibold">{userData.birthday}</p>
          </div>
  
          <div>
            <p className="text-gray-600">Ngày tạo tài khoản:</p>
            <p className="font-semibold">{userData.datecreated}</p>
          </div>
  
          <div>
            <p className="text-gray-600">Giới tính:</p>
            <p className="font-semibold">{userData.gender}</p>
          </div>
  
          <div>
            <p className="text-gray-600">Số điện thoại:</p>
            <p className="font-semibold">{userData.phone}</p>
          </div>
  
          <div>
            <p className="text-gray-600">Vai trò:</p>
            <p className="font-semibold">{userData.rolename}</p>
          </div>
  
          <div>
            <p className="text-gray-600">Gói:</p>
            <p className="font-semibold">{userData.tier}</p>
          </div>
        </div>
        <div style={{ width: '98%', height: '5px', backgroundColor: 'black' }} className="my-6 mx-auto"></div>
          <h2>Tin đã đăng</h2>
          <div>
          {userData.posts && userData.posts.length > 0 ? (
            <table>
            <thead>

                <th>ID</th>
                <th>Tên</th>
                <th>Ngày tạo</th>
                <th>Địa chỉ</th>
                <th>Trạng thái Tin</th>
                <th>Giá </th>
                <th>Diện tích </th>
            </thead>
              
                   
                      
                           <tbody>
                           {userData.posts.map((post) => (
                               <tr key={post.id}>
                                   <td><span>{post.id}</span></td>
                                   <td>
                                       <div>
                                           {/* {post.actualFile && (<img
                                               src={`${image}/${post.actualFile}`}
                                               className="dashboard-content-avatar "
                                               alt="not found"
                                           />)} */}
                                           <span>{post.title}</span>
                                       </div>
                                   </td>
                                   <td><span>{calculateElapsedTime(post)}</span></td>
                                   <td><span>{post.address}</span></td>
                                   <td><span>{post.isHire}</span></td>
                                   <td><span>{post.price}</span></td>
                                   <td><span>{post.area}m²</span></td>
                               </tr>
                               ))}
                           </tbody>                           
           </table>
          ) : (
            <p>Không có bài đăng nào thuộc người dùng này</p>
          )}
          </div>
        </div>
        
      ) : (
        <p>Đang lấy thông tin đợi chút nha </p>
      )}
    </div>
  );
};

export default DetailsUser;
