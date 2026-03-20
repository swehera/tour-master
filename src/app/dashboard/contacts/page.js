'use client';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Search, RefreshCw, Trash2, MailOpen, Mail, Eye } from 'lucide-react';
import { contactService } from '@/services/contact.service';
import { Table, Pagination } from '@/components/dashboard/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { formatDateTime } from '@/utils/formatDate';

const typeColor = (type) => ({
  general:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  booking:   'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  custom:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  complaint: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  other:     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}[type] || 'bg-gray-100 text-gray-700');

export default function ContactsPage() {
  const [contacts,  setContacts]  = useState([]);
  const [meta,      setMeta]      = useState({});
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('');
  const [page,      setPage]      = useState(1);
  const [selected,  setSelected]  = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (filter === 'unread') params.is_read = false;
      if (filter === 'read')   params.is_read = true;
      const res = await contactService.getAll(params);
      setContacts(res.data?.data?.contacts || []);
      setMeta(res.data?.data?.meta         || {});
    } catch { toast.error('Failed to load contacts'); }
    finally  { setLoading(false); }
  }, [page, search, filter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleView = async (contact) => {
    setSelected(contact);
    if (!contact.is_read) {
      try {
        await contactService.markRead(contact.id);
        setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, is_read: true } : c));
      } catch {}
    }
  };

  const handleDelete = async () => {
    try {
      await contactService.delete(deleteId);
      toast.success('Contact deleted');
      setDeleteId(null);
      fetchContacts();
    } catch { toast.error('Delete failed'); }
  };

  const handleMarkRead = async (id) => {
    try {
      await contactService.markRead(id);
      toast.success('Marked as read');
      fetchContacts();
    } catch { toast.error('Failed to update'); }
  };

  const columns = [
    { key: 'status', label: '', render: r => (
      <div className="flex items-center justify-center w-8">
        {r.is_read
          ? <MailOpen className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          : <Mail className="w-4 h-4 text-sky-500" />}
      </div>
    )},
    { key: 'name', label: 'Sender', render: r => (
      <div>
        <p className={`font-medium ${!r.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
          {r.name}
        </p>
        <p className="text-xs text-gray-400">{r.email}</p>
      </div>
    )},
    { key: 'type', label: 'Type', render: r => (
      <span className={`badge-status ${typeColor(r.type)}`}>{r.type}</span>
    )},
    { key: 'message', label: 'Message', render: r => (
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{r.message}</p>
    )},
    { key: 'created_at', label: 'Received', render: r => (
      <span className="text-xs text-gray-400">{formatDateTime(r.created_at)}</span>
    )},
    { key: 'actions', label: 'Actions', render: r => (
      <div className="flex items-center gap-1">
        <button onClick={() => handleView(r)}
          className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors" title="View">
          <Eye className="w-4 h-4" />
        </button>
        {!r.is_read && (
          <button onClick={() => handleMarkRead(r.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Mark as read">
            <MailOpen className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => setDeleteId(r.id)}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  const unreadCount = contacts.filter(c => !c.is_read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            Contact Messages
            {unreadCount > 0 && (
              <span className="text-sm font-medium px-2.5 py-1 bg-sky-500 text-white rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{meta.total || 0} total messages</p>
        </div>
        <Button variant="secondary" size="icon" onClick={fetchContacts}><RefreshCw className="w-4 h-4" /></Button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, message…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <Table columns={columns} data={contacts} loading={loading} emptyMessage="No contact messages yet" />
        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={10} onPage={setPage} />
      </div>

      {/* View Message Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Contact Message" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <a href={`mailto:${selected.email}`} className="font-semibold text-sky-500 hover:underline">{selected.email}</a>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selected.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Type</p>
                <span className={`badge-status ${typeColor(selected.type)}`}>{selected.type}</span>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Received</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDateTime(selected.created_at)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Message</p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={`mailto:${selected.email}?subject=Re: Your inquiry&body=Hi ${selected.name},%0D%0A%0D%0A`}
                className="flex-1 text-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors">
                Reply via Email
              </a>
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Message"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}>
        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to delete this message? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
