import React from 'react';
import './ModernTable.css';

const ModernTable = ({ 
  title, 
  children, 
  actions, 
  className = '',
  loading = false,
  empty = false,
  emptyMessage = 'Không có dữ liệu',
  ...props 
}) => {
  if (loading) {
    return (
      <div className={`modern-table-container ${className}`}>
        <div className="modern-table-header">
          <div className="skeleton skeleton-text" style={{ width: '200px', height: '24px' }}></div>
          <div className="modern-table-actions">
            <div className="skeleton skeleton-text" style={{ width: '120px', height: '36px' }}></div>
          </div>
        </div>
        <div className="modern-table-content">
          <div className="skeleton-table">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-row">
                {[...Array(6)].map((_, cellIndex) => (
                  <div key={cellIndex} className="skeleton skeleton-text"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`modern-table-container ${className}`}>
        {(title || actions) && (
          <div className="modern-table-header">
            {title && <h2 className="modern-table-title">{title}</h2>}
            {actions && <div className="modern-table-actions">{actions}</div>}
          </div>
        )}
        <div className="modern-table-empty">
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="empty-title">Chưa có dữ liệu</h3>
            <p className="empty-message">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`modern-table-container animate-fade-in ${className}`} {...props}>
      {(title || actions) && (
        <div className="modern-table-header">
          {title && <h2 className="modern-table-title">{title}</h2>}
          {actions && <div className="modern-table-actions">{actions}</div>}
        </div>
      )}
      <div className="modern-table-content">
        <div className="table-responsive">
          {children}
        </div>
      </div>
    </div>
  );
};

// Modern Table Row Component
export const ModernTableRow = ({ children, className = '', hover = true, ...props }) => {
  return (
    <tr 
      className={`modern-table-row ${hover ? 'hover-enabled' : ''} ${className}`} 
      {...props}
    >
      {children}
    </tr>
  );
};

// Modern Table Cell Component
export const ModernTableCell = ({ children, className = '', align = 'left', ...props }) => {
  return (
    <td 
      className={`modern-table-cell text-${align} ${className}`} 
      {...props}
    >
      {children}
    </td>
  );
};

// Modern Table Header Cell Component
export const ModernTableHeaderCell = ({ children, className = '', sortable = false, onSort, sortDirection, ...props }) => {
  return (
    <th 
      className={`modern-table-header-cell ${sortable ? 'sortable' : ''} ${className}`}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="header-cell-content">
        {children}
        {sortable && (
          <div className={`sort-indicator ${sortDirection || ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 14l5-5 5 5" />
            </svg>
          </div>
        )}
      </div>
    </th>
  );
};

// Action Button Component
export const ActionButton = ({ 
  variant = 'primary', 
  size = 'sm', 
  icon, 
  children, 
  className = '', 
  loading = false,
  ...props 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className}`;
  
  return (
    <button className={buttonClass} disabled={loading} {...props}>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, children, className = '' }) => {
  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'success':
      case 'đã duyệt':
        return 'success';
      case 'pending':
      case 'waiting':
      case 'chưa được thử':
      case 'chưa duyệt':
        return 'warning';
      case 'inactive':
      case 'rejected':
      case 'error':
      case 'đã từ chối':
        return 'error';
      case 'info':
      case 'draft':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const variant = getBadgeVariant(status);
  
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children || status}
    </span>
  );
};

// Modern Pagination Component
export const ModernPagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 10,
  className = '' 
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = generatePageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`modern-pagination ${className}`}>
      {showInfo && (
        <div className="pagination-info">
          <span className="text-secondary">
            Hiển thị {startItem} - {endItem} của {totalItems} kết quả
          </span>
        </div>
      )}
      
      <div className="pagination-controls">
        <button 
          className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Trước
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            className={`pagination-item ${
              page === currentPage ? 'active' : ''
            } ${
              page === '...' ? 'ellipsis' : ''
            }`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        
        <button 
          className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModernTable;