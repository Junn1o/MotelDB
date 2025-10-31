# 📚 Modern Components Guide

## Overview
This guide covers the new modern UI components that replace the old MUI DataGrid implementations. These components provide a consistent, beautiful, and highly functional interface for the MotelDB admin dashboard.

## 🎯 Components

### 1. ModernTable
The main table wrapper that provides consistent styling and functionality.

```jsx
import ModernTable from '../common/ModernTable';

<ModernTable 
  title="Table Title"
  actions={<ActionButtons />}
  loading={false}
  empty={false}
  emptyMessage="No data found"
>
  <table className="table">
    {/* Table content */}
  </table>
</ModernTable>
```

**Props:**
- `title` - Table header title
- `actions` - Action buttons/controls in header
- `loading` - Shows skeleton loading state
- `empty` - Shows empty state
- `emptyMessage` - Custom empty state message

### 2. ModernTableRow & ModernTableCell
Enhanced table row and cell components.

```jsx
import { ModernTableRow, ModernTableCell } from '../common/ModernTable';

<ModernTableRow className="highlighted">
  <ModernTableCell align="center">
    Content
  </ModernTableCell>
</ModernTableRow>
```

**ModernTableRow Props:**
- `hover` - Enable hover effects (default: true)
- `className` - Additional CSS classes (featured, highlighted, warning)

**ModernTableCell Props:**
- `align` - Text alignment (left, center, right)

### 3. ModernTableHeaderCell
Enhanced header cell with sorting support.

```jsx
import { ModernTableHeaderCell } from '../common/ModernTable';

<ModernTableHeaderCell 
  sortable={true}
  sortDirection="asc"
  onSort={handleSort}
>
  Column Title
</ModernTableHeaderCell>
```

**Props:**
- `sortable` - Enable sorting functionality
- `sortDirection` - Current sort direction (asc, desc)
- `onSort` - Sort handler function

### 4. ActionButton
Consistent action buttons with various states.

```jsx
import { ActionButton } from '../common/ModernTable';

<ActionButton
  variant="primary"
  size="sm"
  loading={false}
  icon={<Icon />}
  onClick={handleClick}
>
  Button Text
</ActionButton>
```

**Props:**
- `variant` - Button style (primary, secondary, success, warning, error)
- `size` - Button size (sm, md, lg)
- `loading` - Shows loading spinner
- `icon` - Icon element
- `disabled` - Disabled state

### 5. StatusBadge
Color-coded status indicators.

```jsx
import { StatusBadge } from '../common/ModernTable';

<StatusBadge status="approved">
  Đã Duyệt
</StatusBadge>
```

**Status Auto-mapping:**
- `approved`, `success`, `đã duyệt` → Green (success)
- `pending`, `waiting`, `chưa duyệt` → Yellow (warning)
- `rejected`, `error`, `đã từ chối` → Red (error)
- `info`, `draft` → Blue (info)
- Default → Gray (secondary)

### 6. ModernPagination
Advanced pagination component.

```jsx
import { ModernPagination } from '../common/ModernTable';

<ModernPagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={totalItems}
  itemsPerPage={pageSize}
  showInfo={true}
/>
```

**Features:**
- Smart page number display
- Ellipsis for large page counts
- Items count information
- Responsive design

## 🎨 Styling Classes

### Table Row States
```css
.modern-table-row.featured      /* Blue highlight */
.modern-table-row.highlighted   /* Green highlight */
.modern-table-row.warning       /* Yellow highlight */
.modern-table-row.selected      /* Selection state */
```

### Button Variants
```css
.btn-primary    /* Blue gradient */
.btn-success    /* Green gradient */
.btn-warning    /* Yellow gradient */
.btn-error      /* Red gradient */
.btn-secondary  /* Gray border */
```

### Badge Variants
```css
.badge-success     /* Green */
.badge-warning     /* Yellow */
.badge-error       /* Red */
.badge-info        /* Blue */
.badge-secondary   /* Gray */
```

## 🔄 Migration Guide

### From MUI DataGrid to ModernPostTable

**Old (MUI):**
```jsx
import { DataGrid } from '@mui/x-data-grid';

<DataGrid
  rows={data}
  columns={columns}
  loading={loading}
  hideFooterPagination={true}
/>
```

**New (Modern):**
```jsx
import ModernTable, { 
  ModernTableRow, 
  ModernTableCell,
  ActionButton 
} from '../common/ModernTable';

<ModernTable title="Posts" loading={loading}>
  <table className="table">
    <thead>
      <tr>
        <ModernTableHeaderCell>ID</ModernTableHeaderCell>
        <ModernTableHeaderCell>Title</ModernTableHeaderCell>
        <ModernTableHeaderCell>Actions</ModernTableHeaderCell>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <ModernTableRow key={row.id}>
          <ModernTableCell>{row.id}</ModernTableCell>
          <ModernTableCell>{row.title}</ModernTableCell>
          <ModernTableCell>
            <ActionButton variant="primary" size="sm">
              Edit
            </ActionButton>
          </ModernTableCell>
        </ModernTableRow>
      ))}
    </tbody>
  </table>
</ModernTable>
```

### Key Benefits of Migration

1. **Consistent Design** - Matches the new design system
2. **Better Performance** - No heavy MUI dependencies
3. **More Flexible** - Easy to customize and extend
4. **Responsive** - Mobile-first design
5. **Accessible** - Better keyboard and screen reader support
6. **Loading States** - Built-in skeleton loading
7. **Empty States** - Professional empty state handling

## 🎯 Examples

### Complete Table Implementation

```jsx
const MyTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const tableActions = (
    <div className="flex items-center gap-3">
      <ActionButton 
        variant="primary"
        icon={<DownloadIcon />}
        onClick={exportData}
      >
        Export CSV
      </ActionButton>
      
      <input
        type="text"
        placeholder="Search..."
        className="form-input"
        style={{ width: '200px' }}
      />
    </div>
  );

  if (loading) {
    return <ModernTable title="My Data" loading={true} />;
  }

  if (data.length === 0) {
    return (
      <ModernTable 
        title="My Data" 
        actions={tableActions}
        empty={true} 
        emptyMessage="No data available"
      />
    );
  }

  return (
    <div className="space-y-6">
      <ModernTable title="My Data" actions={tableActions}>
        <table className="table">
          <thead>
            <tr>
              <ModernTableHeaderCell>ID</ModernTableHeaderCell>
              <ModernTableHeaderCell>Name</ModernTableHeaderCell>
              <ModernTableHeaderCell>Status</ModernTableHeaderCell>
              <ModernTableHeaderCell>Actions</ModernTableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <ModernTableRow key={item.id}>
                <ModernTableCell>{item.id}</ModernTableCell>
                <ModernTableCell>
                  <span className="font-medium">{item.name}</span>
                </ModernTableCell>
                <ModernTableCell>
                  <StatusBadge status={item.status}>
                    {item.status}
                  </StatusBadge>
                </ModernTableCell>
                <ModernTableCell>
                  <div className="flex items-center gap-2">
                    <ActionButton variant="success" size="sm">
                      Edit
                    </ActionButton>
                    <ActionButton variant="error" size="sm">
                      Delete
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
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={data.length}
        itemsPerPage={10}
      />
    </div>
  );
};
```

### Multi-Select Table (Like Role Management)

```jsx
const MultiSelectTable = () => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === data.length ? [] : data.map(item => item.id)
    );
  };

  return (
    <ModernTable title="User Management">
      <table className="table">
        <thead>
          <tr>
            <ModernTableHeaderCell>
              <input 
                type="checkbox"
                className="form-checkbox"
                checked={selectedIds.length === data.length && data.length > 0}
                onChange={handleSelectAll}
              />
            </ModernTableHeaderCell>
            <ModernTableHeaderCell>Name</ModernTableHeaderCell>
            <ModernTableHeaderCell>Role</ModernTableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <ModernTableRow 
              key={user.id}
              className={selectedIds.includes(user.id) ? 'selected' : ''}
            >
              <ModernTableCell>
                <input 
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleSelectRow(user.id)}
                />
              </ModernTableCell>
              <ModernTableCell>{user.name}</ModernTableCell>
              <ModernTableCell>
                <StatusBadge status={user.role}>
                  {user.role}
                </StatusBadge>
              </ModernTableCell>
            </ModernTableRow>
          ))}
        </tbody>
      </table>
    </ModernTable>
  );
};
```

## 🎨 Customization

### Custom Styling
All components use CSS variables from the design system:

```css
/* Custom table styling */
.my-custom-table .modern-table-container {
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
}

.my-custom-table .modern-table-row:hover {
  background: linear-gradient(90deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    transparent 100%);
}
```

### Custom Status Badge Colors
```jsx
// Custom status mapping
const getCustomBadgeStatus = (status) => {
  switch(status) {
    case 'vip': return 'warning';
    case 'premium': return 'success';
    default: return 'secondary';
  }
};

<StatusBadge status={getCustomBadgeStatus(item.type)}>
  {item.type}
</StatusBadge>
```

## 🚀 Performance Tips

1. **Use React.memo** for table rows with large datasets
2. **Implement virtual scrolling** for 500+ rows
3. **Debounce search inputs** to avoid excessive API calls
4. **Use skeleton loading** instead of spinners
5. **Paginate data** rather than loading everything at once

## 🔧 Integration with Existing Pages

### Step 1: Import Components
```jsx
import ModernTable, { 
  ModernTableRow, 
  ModernTableCell, 
  ModernTableHeaderCell,
  ActionButton, 
  StatusBadge, 
  ModernPagination 
} from '../common/ModernTable';
```

### Step 2: Replace MUI DataGrid
Remove:
```jsx
import { DataGrid } from '@mui/x-data-grid';
```

Replace with Modern components structure.

### Step 3: Update Pagination Logic
Replace MUI pagination with `ModernPagination`.

### Step 4: Style Adjustments
Add any custom styling using the provided CSS classes.

## 📱 Responsive Design

All components are mobile-first and include:
- Responsive table scrolling
- Stacked layouts on mobile
- Touch-friendly buttons
- Optimized spacing

## ♿ Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility  
- Focus management
- Color contrast compliance

---

**Ready to modernize your tables!** 🚀

These components provide a solid foundation for building beautiful, functional, and accessible data tables in the MotelDB admin dashboard.