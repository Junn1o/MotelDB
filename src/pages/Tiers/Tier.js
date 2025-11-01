import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import { toast } from 'react-toastify';
import '../styles.css';
import {  getTiers, updateTier, deleteTier } from '../../api/api';
import ConfirmationModal from '../../components/Users/ConfirmationModal'
import TierList from '../../components/Tier/TierList'
import TierForm from '../../components/Tier/TierForm'
import Pagination from '../../components/Tier/Pagination'
function Users() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [totalUsers, settotalUsers] = useState(0);
    const [search, ___setSearch] = useState('');
    const [editingTier, setEditingTier] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tiers, setTiers] = useState([]);
    const handleEdit = (tier) => {
        setEditingTier(tier);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditingTier(null);
        setIsEditing(false);
    };
    const handleSave = async (event) => {
        event.preventDefault();
        try {
            await updateTier({
                ...editingTier
            });
            
            toast.success('Thông tin đã được cập nhật', {
                position: 'top-right',
                autoClose: 3000, // Đóng thông báo sau 3 giây
                hideProgressBar: false,
            });
            setEditingTier(null);
            setIsEditing(false);
            const updateTiers = tiers.map((tier) =>
            tier.id === editingTier.id ? editingTier : tier
            );
            setTiers(updateTiers);
        } catch (error) {
            toast.error('Lỗi không sửa được người dùng', {
                position: 'top-right',
                autoClose: 3000, // Đóng thông báo sau 3 giây
                hideProgressBar: false,
            });
        }
    };
    const fetchData = async () => {
        try {
            const tierResponse = await getTiers(currentPage);
            setTiers(tierResponse.data.tiers);
            setTotalPages(tierResponse.data.totalPages);
         
            // const roleResponse = await getRoles();
            // setRoles(roleResponse.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage]);
    const handleDelete = (tierId) => {
        // Hiển thị toast để xác nhận trước khi xóa
        toast.info(
            <ConfirmationModal
                handleDeleteConfirmed={() => handleDeleteConfirmed(tierId)}
                hideToast={hideToast}
            />,
            {
                position: 'top-right',
                autoClose: false,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        );
    };

    const handleDeleteConfirmed = async (tierId) => {
        // Gửi yêu cầu xóa đến API
        try {
            await deleteTier(tierId);
            const updatedTier = tierId.filter((tier) => tier.id !== tierId);
            setTiers(updatedTier);

            toast.success('Xóa dữ liệu thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });
        } catch (error) {
            toast.error('Xóa dữ liệu không thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });
            
        }
        const hide={hideToast}
    };
    const hideToast = () => {
        // Ẩn toast nếu người dùng hủy bỏ
        toast.dismiss();
    };
    // const __handleSearch = (event) => {
    //     const searchTerm = event.target.value.toLowerCase();
    //     setSearch(searchTerm);

    //     if (searchTerm !== '') {
    //         let search_results = tiers.filter((tier) =>
    //         tier.tiername.toLowerCase().includes(searchTerm) 
                
    //         );
    //         setTiers(search_results);
    //         setTotalPages(1); // Reset total pages when search results change
    //         setCurrentPage(1); // Reset current page to 1 when search results change
    //     } else {
    //         axios.get(`https://localhost:7139/api/Tiers/get-all-tier?pageNumber=${currentPage}&pageSize=5`)
    //             .then((response) => {
    //                 const tierData = response.data.tiers;
    //                 setTiers(tierData);
    //                 setTotalPages(response.data.totalPages);

    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //     }
    // };
    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
    }
    return (
        <div className='dashboard-content'>
            <DashboardHeader  />

            <div className='dashboard-content-container  relative'>
                <div className='dashboard-content-header'>
                    <h2 className='text-white'>Danh Sách Gói</h2>
                    <div className='dashboard-content-search'>
                        <input
                            type='text'
                            value={search}
                            placeholder='Search..'
                            className='dashboard-content-input'
                            // onChange={e => __handleSearch(e)} 
                            />
                    </div>
                    
                </div>
                
                <TierList tiers={tiers} handleEdit={handleEdit} handleDelete={handleDelete} />
                <TierForm
                    editingTier={editingTier}
                    isEditing={isEditing}
                    setEditingTier={setEditingTier}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    
                />
                <Pagination totalPages={totalPages} handlePageClick={handlePageClick} />
            </div>
        </div>
    )
}

export default Users;
