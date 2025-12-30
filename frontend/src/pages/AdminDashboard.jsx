import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [modal, setModal] = useState({ isOpen: false, action: null, userId: null, userName: null });

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users?page=${currentPage}&limit=10`);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/activate`);
      toast.success('User activated successfully');
      fetchUsers();
      setModal({ isOpen: false, action: null, userId: null, userName: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error activating user');
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/deactivate`);
      toast.success('User deactivated successfully');
      fetchUsers();
      setModal({ isOpen: false, action: null, userId: null, userName: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deactivating user');
    }
  };

  const openModal = (action, userId, userName) => {
    setModal({
      isOpen: true,
      action,
      userId,
      userName
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, action: null, userId: null, userName: null });
  };

  const confirmAction = () => {
    if (modal.action === 'activate') {
      handleActivate(modal.userId);
    } else if (modal.action === 'deactivate') {
      handleDeactivate(modal.userId);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id || user._id}>
                        <td>{user.email}</td>
                        <td>{user.fullName}</td>
                        <td>
                          <span className={`badge badge-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          {user.status === 'active' ? (
                            <button
                              className="btn-danger btn-sm"
                              onClick={() => openModal('deactivate', user.id || user._id, user.fullName)}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="btn-success btn-sm"
                              onClick={() => openModal('activate', user.id || user._id, user.fullName)}
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrevPage || loading}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} total users)
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={modal.action === 'activate' ? 'Activate User' : 'Deactivate User'}
        message={`Are you sure you want to ${modal.action} ${modal.userName}?`}
        confirmText={modal.action === 'activate' ? 'Activate' : 'Deactivate'}
      />
    </div>
  );
};

export default AdminDashboard;

