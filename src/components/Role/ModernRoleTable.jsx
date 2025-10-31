import React, { useState, useEffect } from 'react';
import { getUserRole, getRoles, putUserRole } from '../../api/api';
import ModernTable, { 
  ModernTableRow, 
  ModernTableCell, 
  ModernTableHeaderCell, 
  ActionButton, 
  StatusBadge, 
  ModernPagination 
} from '../common/ModernTable';
import ConfirmationModal from '../Users/ConfirmationModal';
import { toast } from 'react-toastify';

const ModernRoleTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [data, setData] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    loadData(page, pageSize);
    loadRoles();
  }, [page, pageSize]);

  useEffect(() => {
    // Filter data based on search
    if (!searchValue.trim()) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(user => 
        user.fullname?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.rolename?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchValue, data]);

  const loadData = async (page, pageSize) => {
    setLoading(true);
    try {
      const apiData = await getUserRole(page, pageSize);
      setData(apiData.data.users || []);
      setTotalCount(apiData.data.total || 0);
      setTotalPage(apiData.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu người dùng', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const apiRole = await getRoles();
      setRoleOptions(apiRole.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Không thể tải danh sách vai trò', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedIds([]); // Clear selections when changing page
  };

  const handleSelectRow = (userId) => {
    setSelectedIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(user => user.id));
    }
  };

  const handleUpdateRole = () => {
    if (!selectedRoleId) {
      toast.warning('Vui lòng chọn vai trò muốn cập nhật', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (selectedIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một người dùng', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const selectedRole = roleOptions.find(role => role.id === selectedRoleId);
    const selectedUsersCount = selectedIds.length;
    
    toast.info(
      <ConfirmationModal
        message={`Bạn có chắc muốn cập nhật vai trò "${selectedRole?.rolename}" cho ${selectedUsersCount} người dùng?`}
        handleDeleteConfirmed={handleUpdateConfirmed}
        hideToast={hideToast}
      />,
      {
        position: 'top-right',
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleUpdateConfirmed = async () => {
    try {
      await putUserRole(selectedIds, selectedRoleId);
      toast.success('Cập nhật vai trò thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Reload data and clear selections
      loadData(page, pageSize);
      setSelectedIds([]);
      setSelectedRoleId(null);
    } catch (error) {
      console.error('Error updating roles:', error);
      toast.error('Cập nhật vai trò không thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const hideToast = () => {
    toast.dismiss();
  };

  const exportToCsv = () => {
    const header = ['ID', 'Họ Tên', 'Vai Trò', 'Số Điện Thoại'].join(',');
    const csv = [header];
    
    filteredData.forEach((row) => {
      const rowData = [
        row.id,
        `"${row.fullname || ''}"`.replace(/"/g, '""'),
        `"${row.rolename || ''}"`.replace(/"/g, '""'),
        row.phone || ''
      ].join(',');
      
      csv.push(rowData);
    });
    
    const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'user_roles_data.csv');
    link.click();
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'user':
        return 'info';
      case 'moderator':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const tableActions = (
    <div className="flex items-center gap-3 flex-wrap">
      <ActionButton 
        variant="primary" 
        onClick={exportToCsv}
        disabled={filteredData.length === 0}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        }
      >
        Tải xuống CSV
      </ActionButton>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, SĐT, vai trò..."
          className="form-input"
          style={{ width: '250px' }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </div>
  );

  const roleManagementPanel = (
    <div className="card">
      <div className="card-body">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Quản lý vai trò
        </h3>
        
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <label className="form-label">Chọn vai trò mới</label>
            <select 
              className="form-input"
              value={selectedRoleId || ''}
              onChange={(e) => setSelectedRoleId(parseInt(e.target.value))}
            >
              <option value="">-- Chọn vai trò --</option>
              {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.rolename}
                </option>
              ))}
            </select>
          </div>
          
          <ActionButton 
            variant="primary"
            onClick={handleUpdateRole}
            disabled={selectedIds.length === 0 || !selectedRoleId}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
              </svg>
            }
          >
            Cập nhật vai trò ({selectedIds.length})
          </ActionButton>
          
          {selectedIds.length > 0 && (
            <ActionButton 
              variant="secondary"
              onClick={() => setSelectedIds([])}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              }
            >
              Bỏ chọn tất cả
            </ActionButton>
          )}
        </div>
        
        {selectedIds.length > 0 && (
          <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-primary-700">
              <strong>{selectedIds.length}</strong> người dùng được chọn. 
              Chọn vai trò và nhấn "Cập nhật vai trò" để thực hiện thay đổi.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {roleManagementPanel}
        <ModernTable 
          title="Quản lý vai trò người dùng" 
          loading={true} 
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="space-y-6">
        {roleManagementPanel}
        <ModernTable 
          title="Quản lý vai trò người dùng" 
          actions={tableActions}
          empty={true} 
          emptyMessage="Không có người dùng nào trong hệ thống"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roleManagementPanel}
      
      <ModernTable title="Quản lý vai trò người dùng" actions={tableActions}>
        <table className="table">
          <thead>
            <tr>
              <ModernTableHeaderCell>
                <input 
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                />
              </ModernTableHeaderCell>
              <ModernTableHeaderCell>ID</ModernTableHeaderCell>
              <ModernTableHeaderCell>Họ tên</ModernTableHeaderCell>
              <ModernTableHeaderCell>Vai trò</ModernTableHeaderCell>
              <ModernTableHeaderCell>Số điện thoại</ModernTableHeaderCell>
              <ModernTableHeaderCell>Trạng thái</ModernTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <ModernTableRow 
                key={user.id}
                className={selectedIds.includes(user.id) ? 'highlighted' : ''}
              >
                <ModernTableCell>
                  <input 
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => handleSelectRow(user.id)}
                  />
                </ModernTableCell>
                <ModernTableCell>
                  <span className="font-mono text-sm font-medium">
                    {user.id}
                  </span>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-700">
                        {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-primary">
                        {user.fullname || 'Chưa có tên'}
                      </div>
                      {user.email && (
                        <div className="text-xs text-secondary">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </ModernTableCell>
                <ModernTableCell>
                  <StatusBadge 
                    status={getRoleBadgeColor(user.rolename)}
                    className="font-medium"
                  >
                    {user.rolename || 'Chưa phân quyền'}
                  </StatusBadge>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="font-mono text-sm">
                    {user.phone || 'Chưa có'}
                  </span>
                </ModernTableCell>
                <ModernTableCell>
                  <StatusBadge 
                    status={user.isActive ? 'success' : 'secondary'}
                  >
                    {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </StatusBadge>
                </ModernTableCell>
              </ModernTableRow>
            ))}
          </tbody>
        </table>
      </ModernTable>

      <ModernPagination
        currentPage={page}
        totalPages={totalPage}
        onPageChange={handlePageChange}
        totalItems={totalCount}
        itemsPerPage={pageSize}
        showInfo={true}
      />
    </div>
  );
};

export default ModernRoleTable;