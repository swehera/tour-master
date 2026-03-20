'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Search, Trash2, Edit, RefreshCw } from 'lucide-react';
import { userService } from '@/services/user.service';
import { Table, Pagination } from '@/components/dashboard/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { statusColor } from '@/utils/helpers';
import { formatDate } from '@/utils/formatDate';

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [meta,    setMeta]    = useState({});
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('');
  const [page,    setPage]    = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ page, limit: 10, search, role });
      setUsers(res.data?.data?.users || []);
      setMeta(res.data?.data?.meta   || {});
    } catch { toast.error('Failed to load users'); }
    finally  { setLoading(false); }
  }, [page, search, role]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    try {
      await userService.delete(deleteId);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const columns = [
    { key: 'name',       label: 'Name',    render: r => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {r.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-xs text-gray-400">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'role',       label: 'Role',    render: r => <span className={`badge-status ${statusColor(r.role)}`}>{r.role}</span> },
    { key: 'is_active',  label: 'Status',  render: r => <span className={`badge-status ${statusColor(r.is_active ? 'active' : 'inactive')}`}>{r.is_active ? 'Active' : 'Inactive'}</span> },
    { key: 'created_at', label: 'Joined',  render: r => formatDate(r.created_at) },
    { key: 'actions',    label: 'Actions', render: r => (
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/users/${r.id}`}>
          <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)} className="text-red-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{meta.total || 0} total users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={fetchUsers}><RefreshCw className="w-4 h-4" /></Button>
          <Link href="/dashboard/users/create">
            <Button><Plus className="w-4 h-4" /> Add User</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="guide">Guide</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <Table columns={columns} data={users} loading={loading} emptyMessage="No users found" />
        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={10} onPage={setPage} />
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}>
        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to delete this user? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
