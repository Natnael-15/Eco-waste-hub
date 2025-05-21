import React, { useEffect, useState } from 'react';
import { FaUsers, FaSearch, FaUserEdit, FaTrash, FaUserPlus, FaSave, FaTimes } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import AdminFooter from '../components/AdminFooter';
import { supabase } from '../lib/supabase';
import { useAdminTheme } from '../context/AdminThemeContext';

const LOCAL_KEY = 'admin_users_local';

// Helper to generate fake users with realistic names and emails, all with role 'user'
function generateFakeUsers(count: number, existingIds: Set<string>) {
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
    'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
  ];
  const fakeUsers = [];
  for (let i = 0; i < count; i++) {
    let id;
    do {
      id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    } while (existingIds.has(id));
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    // Generate a realistic email
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
    fakeUsers.push({
      id,
      name,
      email,
      role: 'user',
      created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    });
    existingIds.add(id);
  }
  return fakeUsers;
}

// Utility to clean up legacy localStorage keys for fake users, orders, and donations
function cleanupLegacyLocalStorage() {
  // Remove old fake users key(s)
  if (localStorage.getItem('users')) localStorage.removeItem('users');
  // Remove old fake orders key(s)
  if (localStorage.getItem('orders')) localStorage.removeItem('orders');
  // Remove old fake donations key(s)
  if (localStorage.getItem('donations')) localStorage.removeItem('donations');
}

const AdminUsers: React.FC = () => {
  const { darkMode, toggleDarkMode } = useAdminTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<any>({});

  // Always merge real users with fake users, regardless of localStorage
  useEffect(() => {
    const loadAndMergeUsers = async () => {
      setLoading(true);
      // Fetch real users from Supabase
      let realUsers: any[] = [];
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, role, created_at');
        if (error) {
          console.error('Error fetching users:', error);
        } else {
          realUsers = data || [];
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }

      // Load users from localStorage (if any)
      let localUsers: any[] = [];
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        try {
          localUsers = JSON.parse(local);
        } catch {}
      }

      // Remove any real users from localUsers (by id) to avoid duplicates
      const realIds = new Set(realUsers.map(u => u.id));
      const filteredLocal = localUsers.filter(u => !realIds.has(u.id));

      // Generate fake users, ensuring no ID collision with real users or local users
      const existingIds = new Set([...realUsers.map(u => u.id), ...filteredLocal.map(u => u.id)]);
      const fakeUsers = generateFakeUsers(200, existingIds);

      // Merge: real users + local (non-real) users + new fakes
      const merged = [...realUsers, ...filteredLocal, ...fakeUsers];
      setUsers(merged);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
      setLoading(false);
    };
    loadAndMergeUsers();
  }, []);

  // Save to localStorage on users change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(users));
    }
  }, [users, loading]);

  // Automatic cleanup of legacy localStorage keys
  useEffect(() => {
    cleanupLegacyLocalStorage();
  }, []);

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.id || '').toLowerCase().includes(search.toLowerCase())
  );

  // Edit logic
  const startEdit = (user: any) => {
    setEditId(user.id);
    setEditUser({ ...user });
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditUser({});
  };
  const saveEdit = () => {
    setUsers(users.map(u => (u.id === editId ? { ...u, ...editUser } : u)));
    setEditId(null);
    setEditUser({});
  };

  // Delete logic
  const deleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Add user (dummy)
  const addUser = () => {
    const newUser = {
      id: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
      name: 'New User',
      email: 'newuser@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
    };
    setUsers([newUser, ...users]);
  };

  return (
    <>
      <AdminNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`min-h-screen bg-gradient-to-br ${darkMode ? 'from-gray-950 via-gray-900 to-gray-950' : 'from-eco-green via-amber-50 to-emerald-100'} py-12 px-4 pb-32 pt-24`}>
        <div className={`max-w-5xl mx-auto ${darkMode ? 'bg-gray-900 border-eco-yellow' : 'bg-white border-eco-green'} rounded-2xl shadow-2xl border-4 p-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 mt-2">
            <h1 className="text-3xl font-bold text-eco-green dark:text-eco-yellow font-playfair flex items-center gap-2">
              <FaUsers className="text-eco-green dark:text-eco-yellow" /> Users
            </h1>
            <div className="flex gap-3 items-center">
              <button onClick={addUser} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-eco-green dark:bg-eco-yellow text-white dark:text-eco-green font-bold shadow hover:bg-eco-yellow hover:text-eco-green dark:hover:bg-eco-green dark:hover:text-eco-yellow transition">
                <FaUserPlus /> Add User
              </button>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-eco-green dark:text-eco-yellow" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border-2 border-eco-green dark:border-eco-yellow bg-white dark:bg-gray-900 text-eco-green dark:text-eco-yellow focus:outline-none focus:ring-2 focus:ring-eco-green/20 dark:focus:ring-eco-yellow/20"
                />
              </div>
            </div>
          </div>
          <div className="overflow-auto max-h-[60vh] rounded-xl shadow">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading users...</div>
            ) : (
              <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl text-sm">
                <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b-2 border-eco-yellow">
                  <tr>
                    <th className="px-4 py-3 text-left text-eco-green dark:text-eco-yellow font-bold whitespace-nowrap">User ID</th>
                    <th className="px-4 py-3 text-left text-eco-green dark:text-eco-yellow font-bold whitespace-nowrap">Name</th>
                    <th className="px-4 py-3 text-left text-eco-green dark:text-eco-yellow font-bold whitespace-nowrap">Email</th>
                    <th className="px-4 py-3 text-left text-eco-green dark:text-eco-yellow font-bold whitespace-nowrap">Role</th>
                    <th className="px-4 py-3 text-left text-eco-green dark:text-eco-yellow font-bold whitespace-nowrap">Created At</th>
                    <th className="px-4 py-3 text-left text-eco-green dark:text-eco-yellow font-bold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, idx) => (
                    <tr
                      key={u.id}
                      className={
                        `transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} ` +
                        'hover:bg-eco-yellow/10 dark:hover:bg-eco-yellow/20'
                      }
                    >
                      <td className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300 max-w-[180px] truncate" title={u.id}>{u.id}</td>
                      {editId === u.id ? (
                        <>
                          <td className="px-4 py-2"><input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" /></td>
                          <td className="px-4 py-2"><input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" /></td>
                          <td className="px-4 py-2"><input value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" /></td>
                          <td className="px-4 py-2">{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button onClick={saveEdit} className="text-green-600 hover:underline" title="Save"><FaSave /></button>
                            <button onClick={cancelEdit} className="text-gray-400 hover:underline" title="Cancel"><FaTimes /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow max-w-[120px] truncate" title={u.name}>{u.name || '-'}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow max-w-[180px] truncate" title={u.email}>{u.email || '-'}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow font-bold uppercase whitespace-nowrap">{u.role || '-'}</td>
                          <td className="px-4 py-2 text-gray-900 dark:text-eco-yellow whitespace-nowrap">{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button onClick={() => startEdit(u)} className="mr-2 text-eco-green dark:text-eco-yellow hover:underline" title="Edit"><FaUserEdit /></button>
                            <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline" title="Delete"><FaTrash /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminUsers; 