import React from 'react';
import {image} from '../../constants/URL'
import './styles.css';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
function DashboardHeader ({ btnText, onClick }) {
    const {user} = useContext(UserContext);
    return(
        <div className='dashbord-header-container'>
            {btnText && 
                <button className='dashbord-header-btn' onClick={onClick}>{btnText}</button>
            }

            <div className='dashbord-header-right gap-2'>
                {user && user.firstname && <span> Chào mừng {user.firstname + " " + user.lastname}</span>}
                {/* <img 
                    src={NotificationIcon}
                    alt='notification-icon'
                    className='dashbord-header-icon' />
                <img 
                    src={SettingsIcon}
                    alt='settings-icon'
                    className='dashbord-header-icon' /> */}
               <img
                                src={`${image}/${localStorage.getItem('avatar')}`}
                                className="dashboard-content-avatar "
                                alt="not found"
                            />
            </div>
        </div>
    )
}

export default DashboardHeader;