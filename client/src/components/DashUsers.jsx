import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Card, Alert } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null); // State for selected user to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal for delete confirmation
  const [isDeleting, setIsDeleting] = useState(false); // Deletion loading state

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users', { withCredentials: true });
        setUsers(response.data.users);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    console.log(user);
    setShowModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    setIsDeleting(true); // Show loading state
    try {
      await axios.delete(`http://localhost:3001/deleteUser/${deleteUserId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deleteUserId));
      setShowDeleteModal(false);
      setDeleteUserId(null);
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false); // Hide loading state
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      {error && <Alert color="failure" className="mb-4">{error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id}>
              <Card className="rounded-lg shadow-lg overflow-hidden">
                <img
                  src={user.profileImg || 'https://via.placeholder.com/150'}
                  alt={user.name || 'User Image'}
                  className="h-40 w-full object-cover"
                />
                <h3 className="text-xl font-bold mt-2">{user.name || 'No Name'}</h3>

                <div className="flex justify-between mt-2 gap-2">
                  <Button onClick={() => handleViewUser(user)}>View Details</Button>
                  <Button
                    color="red"
                    onClick={() => {
                      setDeleteUserId(user._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <p>No users available</p>
        )}
      </div>

      {/* View User Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="lg">
        <Modal.Body>
          {selectedUser && (
            <div className="text-center">
              <img
                src={selectedUser.profileImg || 'https://via.placeholder.com/150'}
                alt={selectedUser.name || 'User Image'}
                className="mx-auto mt-4 mb-4 rounded-full w-32 h-32 object-cover"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedUser.name || 'No Name'}</h2>
              <p className="text-sm text-gray-600 mb-1">Email: {selectedUser.email}</p>
              <p className="text-sm text-gray-600 mb-1">Admin: {selectedUser.isAdmin ? 'Yes' : 'No'}</p>
              <Button color="red" outline className="mt-4" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-700 mx-auto mb-2 dark:text-gray-200" />
            <h1 className="text-xl font-semibold">
              {isDeleting ? 'Deleting user...' : 'Are you sure you want to delete this user?'}
            </h1>
            {!isDeleting && (
              <div className="flex justify-between h-8 mt-2">
                <Button color="failure" outline onClick={handleDeleteUser}>
                  Yes
                </Button>
                <Button color="success" outline onClick={() => setShowDeleteModal(false)}>
                  No
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
