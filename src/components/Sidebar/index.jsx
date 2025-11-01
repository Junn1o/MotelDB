import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

import SideBarItem from './sidebar-item';

import './styles.css';
import LogoutIcon from '../../assets/icons/logout.svg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
function SideBar ({ menu }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(1);
    const {logout,loginContext} = useContext(UserContext);
    useEffect(() => {
        menu.forEach(element => {
            if (location.pathname === element.path) {
                setActive(element.id);
                const path =localStorage.setItem('path',element.path);
                const token = localStorage.getItem('token');
                const userid = localStorage.getItem('userid');
                const firstname = localStorage.getItem('firstname');
                const lastname = localStorage.getItem('lastname');
                const role = localStorage.getItem('role');
                const avatar = localStorage.getItem('avatar');
                loginContext(token,userid,firstname,lastname,role,avatar,path)
            }   
        });
        
    }, [location.pathname])

    const __navigate = (id) => {
        setActive(id);
        const path = localStorage.removeItem('path');
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userid');
                const firstname = localStorage.getItem('firstname');
                const lastname = localStorage.getItem('lastname');
                const role = localStorage.getItem('role');
                const avatar = localStorage.getItem('avatar');
        loginContext(token,userid,firstname,lastname,role,avatar,path)
    }
const handleLogout  = () => {
    logout();
    navigate('/login')
    toast.success('Đăng xuất thành công');
}
    return(
        <nav className='sidebar'>
            <div className='sidebar-container'>
                <div className='sidebar-logo-container'>
                   <p className='ml-[80px] mt-[20px] text-white '>Admin</p>
                </div>

                <div className='sidebar-container'>
                    <div className='sidebar-items'>
                        {menu.map((item, index) => (
                            <div key={index} onClick={() => __navigate(item.id)}>
                                <SideBarItem
                                    active={item.id === active}
                                    item={item} />
                            </div>
                        ))}
                    </div>

                    <div className='sidebar-footer' onClick={() => handleLogout()}>
                        <span className='sidebar-item-label'
                        >Logout</span>
                        <img 
                            src={LogoutIcon}
                            alt='icon-logout'
                            className='sidebar-item-icon' />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default SideBar;