import React, { useState, useEffect } from 'react';
import { deletePost, getPostData } from '../../api/api';
import EditDialog from './EditPost_Dialog';
import ApprovePost from './ApprovePost';
import ConfirmationModal from '../Users/ConfirmationModal';
import ModernTable, { 
  ModernTableRow, 
  ModernTableCell, 
  ModernTableHeaderCell, 
  ActionButton, 
  StatusBadge, 
  ModernPagination 
} from '../common/ModernTable';
import { toast } from 'react-toastify';

const ModernPostTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedDataApprove, setSelectedDataApprove] = useState(null);
  
  // Filter states
  const [showMoreStates, setShowMoreStates] = useState({});
  const [sortby, setSortBy] = useState('dateCreated');
  const [isAscending, setIsAscending] = useState(null);
  const [hireState, setHireState] = useState(null);
  const [statusState, setStatusState] = useState('Đang Chờ Duyệt');
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minArea, setMinArea] = useState(null);
  const [maxArea, setMaxArea] = useState(null);
  const [category, setCategory] = useState(null);
  const [isVip, setIsVip] = useState(null);
  const [phoneNumb, setPhoneNumb] = useState(null);
  const [address, setAddress] = useState(null);
  const [typeSearch, setTypeSearch] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isApply, setIsApply] = useState(false);

  const toggleShowMore = (rowId) => {
    setShowMoreStates(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const loadData = async (
    hireState, statusState, minPrice, maxPrice, minArea, maxArea, 
    category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize
  ) => {
    setLoading(true);
    try {
      const apiData = await getPostData(
        hireState, statusState, minPrice, maxPrice, minArea, maxArea,
        category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize
      );
      setData(apiData.data.post || []);
      setTotalCount(apiData.data.total || 0);
      setTotalPage(apiData.data.totalPages || 0);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Không thể tải dữ liệu', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(
      hireState, statusState, minPrice, maxPrice, minArea, maxArea,
      category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize
    );
  }, [page, pageSize]);

  const handleEditDialog = (rowData) => {
    setSelectedRowData(rowData);
    setOpenDialog(true);
  };

  const handleApproveDialog = (rowData) => {
    setSelectedDataApprove(rowData);
    setOpenApproveDialog(true);
  };

  const handleDelete = (id) => {
    toast.info(
      <ConfirmationModal
        handleDeleteConfirmed={() => handleDeleteConfirmed(id)}
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

  const hideToast = () => {
    toast.dismiss();
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await deletePost(id);
      toast.success('Xóa bài đăng thành công', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
      });
      // Reload data
      loadData(
        hireState, statusState, minPrice, maxPrice, minArea, maxArea,
        category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize
      );
    } catch (error) {
      toast.error('Xóa bài đăng không thành công', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  const handleCloseDialog = () => {
    loadData(
      hireState, statusState, minPrice, maxPrice, minArea, maxArea,
      category, isVip, phoneNumb, address, sortby, isAscending, page, pageSize
    );
    setSelectedDataApprove(null);
    setSelectedRowData(null);
    setOpenDialog(false);
    setOpenApproveDialog(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    if (typeSearch === 'Theo Địa Chỉ') {
      setPhoneNumb(null);
      loadData(
        hireState, statusState, minPrice, maxPrice, minArea, maxArea,
        category, isVip, null, searchValue, sortby, isAscending, 1, pageSize
      );
    } else if (typeSearch === 'Theo Số Điện Thoại') {
      setAddress(null);
      loadData(
        hireState, statusState, minPrice, maxPrice, minArea, maxArea,
        category, isVip, searchValue, null, sortby, isAscending, 1, pageSize
      );
    } else {
      loadData(
        hireState, statusState, minPrice, maxPrice, minArea, maxArea,
        category, isVip, null, null, sortby, isAscending, 1, pageSize
      );
    }
    setPage(1);
  };

  const handleReset = () => {
    setAddress(null);
    setPhoneNumb(null);
    setTypeSearch(null);
    setHireState(null);
    setStatusState('Đang Chờ Duyệt');
    setSearchValue('');
    setIsApply(false);
    setPage(1);
    loadData(
      null, 'Đang Chờ Duyệt', minPrice, maxPrice, minArea, maxArea,
      category, isVip, null, null, sortby, isAscending, 1, pageSize
    );
  };

  const exportToCsv = () => {
    const header = [
      'ID', 'Tiêu Đề', 'SĐT', 'Mô Tả', 'Địa Chỉ', 'Diện Tích', 
      'Danh Mục', 'Ngày Tạo', 'Ngày Duyệt', 'Giá', 'Trạng Thái Duyệt', 
      'Trạng Thái Thuê', 'Chủ Trọ'
    ].join(',');
    
    const csv = [header];
    
    data.forEach((row) => {
      const rowData = [
        row.id,
        `"${row.title || ''}"`.
place(/"/g, '""'),
        row.phone || '',
        `"${row.description || ''}"`.replace(/"/g, '""'),
        `"${row.address || ''}"`.replace(/"/g, '""'),
        row.area || '',
        `"${row.categorylist ? row.categorylist.join(', ') : ''}"`,
        row.formattedDatecreated || '',
        row.formattedDateapprove || 'Chưa có ngày duyệt',
        row.price || '',
        row.status || '',
        row.isHire || '',
        row.authorname || ''
      ].join(',');
      
      csv.push(rowData);
    });
    
    const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'posts_data.csv');
    link.click();
  };

  const renderDescription = (content, rowId) => {
    if (!content) return '';
    const characterLimit = 100;
    
    if (content.length > characterLimit) {
      return (
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">
            {showMoreStates[rowId] ? content : content.slice(0, characterLimit) + '...'}
          </p>
          <ActionButton 
            variant="secondary" 
            size="sm" 
            onClick={() => toggleShowMore(rowId)}
          >
            {showMoreStates[rowId] ? 'Thu gọn' : 'Xem thêm'}
          </ActionButton>
        </div>
      );
    }
    
    return <p className="text-sm leading-relaxed">{content}</p>;
  };

  const tableActions = (
    <div className="flex items-center gap-3 flex-wrap">
      <ActionButton 
        variant="primary" 
        onClick={exportToCsv}
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
          placeholder="Tìm kiếm..."
          className="form-input"
          style={{ width: '200px' }}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsApply(true);
          }}
        />
        
        <select 
          className="form-input"
          style={{ width: '150px' }}
          value={typeSearch || ''}
          onChange={(e) => {
            setTypeSearch(e.target.value);
            setIsApply(true);
          }}
        >
          <option value="">Tất cả</option>
          <option value="Theo Địa Chỉ">Theo Địa Chỉ</option>
          <option value="Theo Số Điện Thoại">Theo SĐT</option>
        </select>
        
        <select 
          className="form-input"
          style={{ width: '150px' }}
          value={statusState || ''}
          onChange={(e) => {
            setStatusState(e.target.value);
            setIsApply(true);
          }}
        >
          <option value="Đã Duyệt">Đã Duyệt</option>
          <option value="Không Chấp Nhận Duyệt">Không Duyệt</option>
          <option value="Đang Chờ Duyệt">Chờ Duyệt</option>
          <option value="Đã Ẩn">Đã Ẩn</option>
        </select>
        
        <select 
          className="form-input"
          style={{ width: '150px' }}
          value={hireState || ''}
          onChange={(e) => {
            setHireState(e.target.value);
            setIsApply(true);
          }}
        >
          <option value="">Tất cả</option>
          <option value="Chưa Được Thuê">Chưa Thuê</option>
          <option value="Đã Được Thuê">Đã Thuê</option>
        </select>
        
        <ActionButton 
          variant="primary" 
          disabled={!isApply}
          onClick={handleSearch}
        >
          Tìm kiếm
        </ActionButton>
        
        <ActionButton 
          variant="secondary" 
          disabled={!isApply}
          onClick={handleReset}
        >
          Reset
        </ActionButton>
      </div>
    </div>
  );

  if (loading) {
    return (
      <ModernTable 
        title="Quản lý bài đăng" 
        loading={true} 
      />
    );
  }

  if (data.length === 0) {
    return (
      <ModernTable 
        title="Quản lý bài đăng" 
        actions={tableActions}
        empty={true} 
        emptyMessage="Không có bài đăng nào được tìm thấy"
      />
    );
  }

  return (
    <div className="space-y-6">
      <ModernTable title="Quản lý bài đăng" actions={tableActions}>
        <table className="table">
          <thead>
            <tr>
              <ModernTableHeaderCell>ID</ModernTableHeaderCell>
              <ModernTableHeaderCell>Tiêu đề</ModernTableHeaderCell>
              <ModernTableHeaderCell>SĐT</ModernTableHeaderCell>
              <ModernTableHeaderCell>Mô tả</ModernTableHeaderCell>
              <ModernTableHeaderCell>Địa chỉ</ModernTableHeaderCell>
              <ModernTableHeaderCell>Diện tích</ModernTableHeaderCell>
              <ModernTableHeaderCell>Danh mục</ModernTableHeaderCell>
              <ModernTableHeaderCell>Ngày tạo</ModernTableHeaderCell>
              <ModernTableHeaderCell>Ngày duyệt</ModernTableHeaderCell>
              <ModernTableHeaderCell>Giá</ModernTableHeaderCell>
              <ModernTableHeaderCell>Trạng thái</ModernTableHeaderCell>
              <ModernTableHeaderCell>Tình trạng thuê</ModernTableHeaderCell>
              <ModernTableHeaderCell>Chủ trọ</ModernTableHeaderCell>
              <ModernTableHeaderCell>Thao tác</ModernTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <ModernTableRow key={row.id}>
                <ModernTableCell>{row.id}</ModernTableCell>
                <ModernTableCell>
                  <div className="font-medium text-primary max-w-32 truncate" title={row.title}>
                    {row.title}
                  </div>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="font-mono text-sm">{row.phone}</span>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="max-w-48">
                    {renderDescription(row.description, row.id)}
                  </div>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="max-w-40 truncate" title={row.address}>
                    {row.address}
                  </div>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="text-sm font-medium">{row.area} m²</span>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="max-w-32">
                    {row.categorylist && row.categorylist.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {row.categorylist.map((cat, index) => (
                          <span key={index} className="badge badge-info text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-secondary">Chưa phân loại</span>
                    )}
                  </div>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="text-sm text-secondary">
                    {row.formattedDatecreated}
                  </span>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="text-sm text-secondary">
                    {row.formattedDateapprove || 'Chưa duyệt'}
                  </span>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="font-semibold text-success">
                    {row.price ? `${row.price.toLocaleString()} VND` : 'Chưa có'}
                  </span>
                </ModernTableCell>
                <ModernTableCell>
                  <StatusBadge status={row.status}>
                    {row.status}
                  </StatusBadge>
                </ModernTableCell>
                <ModernTableCell>
                  <StatusBadge status={row.isHire}>
                    {row.isHire}
                  </StatusBadge>
                </ModernTableCell>
                <ModernTableCell>
                  <span className="font-medium">{row.authorname}</span>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="flex items-center gap-2">
                    <ActionButton
                      variant="success"
                      size="sm"
                      onClick={() => handleEditDialog(row)}
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      }
                    >
                      Sửa
                    </ActionButton>
                    
                    <ActionButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveDialog(row)}
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 12l2 2 4-4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      }
                    >
                      Duyệt
                    </ActionButton>
                    
                    <ActionButton
                      variant="error"
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6" />
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                        </svg>
                      }
                    >
                      Xóa
                    </ActionButton>
                  </div>
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
      />

      {/* Dialogs */}
      {selectedRowData && (
        <EditDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          rowData={selectedRowData}
        />
      )}

      {selectedDataApprove && (
        <ApprovePost
          open={openApproveDialog}
          handleClose={handleCloseDialog}
          rowData={selectedDataApprove}
        />
      )}
    </div>
  );
};

export default ModernPostTable;