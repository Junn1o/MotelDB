import React, { useState} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { image } from '../../constants/URL';
const Login = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [loadingapi, setLoadingAPI] = useState(false);
    const loginapi = (phone,password) => {  
        return axios.post(`${image}/api/Login`,{phone,password});
    }
    const {loginContext} = useContext(UserContext);
    
      // Lưu trang hiện tại vào localStorage khi component mount


    const handleLogin = async () => {
      setLoadingAPI(true);
        try {
          // Gọi hàm loginapi và đợi kết quả
          const response = await loginapi(phone, password);
          // Lấy token từ response
          const token = response.data.token;
          const userid = response.data.userId;
          const firstname = response.data.firstName;
          const lastname = response.data.lastName;
          const role = response.data.roleId;
          const avatar = response.data.avatar;
          const path = localStorage.setItem('path', window.location.pathname);
          if( role === "1")
          {
            toast.success('Đăng nhập thành công', {
              position: 'top-right',
              autoClose: 3000, // Đóng thông báo sau 3 giây
              hideProgressBar: false,
          });
          
          navigate('/users')
          loginContext(token,userid,firstname,lastname,role,avatar,path)

          }
          else{
            toast.error('Bạn không có quyền truy cập vào trang này', {
              position: 'top-right',
              autoClose: 3000, // Đóng thông báo sau 3 giây
              hideProgressBar: false,
          });
          }
          
        } catch (error) {
          if (error.response) {
            toast.error('Nhập sai tài khoản hoặc mật khẩu vui lòng nhập lại', {
              position: 'top-right',
              autoClose: 3000, // Đóng thông báo sau 3 giây
              hideProgressBar: false,
          });
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser 
            // and an instance of http.ClientRequest in node.js
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          
        }
  setLoadingAPI(false);
    };
    return (
       <div className="bg-no-repeat bg-cover bg-center relative" ><div className="absolute bg-gradient-to-b from-green-500 to-green-400 opacity-75 inset-0 z-0" />
  <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
    <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10">
      <div className="self-start hidden lg:flex flex-col  text-white">
        <h1 className="mb-3 font-bold text-5xl">Chào mừng trở lại </h1>
        
      </div>
    </div>
    <div className="flex justify-center self-center  z-10">
      <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
        <div className="mb-4">
          <h3 className="font-semibold text-2xl text-gray-800">Đăng Nhập </h3>
          <p className="text-gray-500">Vui lòng đăng nhập tài khoản của bạn</p>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">Số Điện Thoại</label>
            <input className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"  placeholder="079......" 
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className=" text-sm font-medium text-gray-700 tracking-wide">
              Mật khẩu
            </label>
            <input className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" type='password' placeholder="Nhập mật khẩu của bạn" 
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-800">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to='/register' className="text-green-400 hover:text-green-500">
                Forgot your password?
              </Link>
            </div>
          </div> */}
          <div>
            <button className="w-full flex gap-2 justify-center items-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
            onClick={() => handleLogin()}>
              {loadingapi &&  <i className="fas fa-circle-notch fa-spin"></i> }
               Đăng nhập
            </button>
          </div>
        </div>
       
      </div>
    </div>
  </div>
</div>

    )
}

export default Login