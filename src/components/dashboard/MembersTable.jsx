import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/payments';
import { makeUserAdmin, revokeAdmin } from '../../services/admin';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function MembersTable() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const users = await getUsers();
        setMembers(users);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleMakeAdmin = async (userId) => {
    const success = await makeUserAdmin(userId);
    if (success) {
      toast.success('User granted admin privileges');
      setMembers(members.map(m => 
        m.id === userId ? {...m, role: 'admin'} : m
      ));
    } else {
      toast.error('Failed to make user admin');
    }
  };

  const handleRevokeAdmin = async (userId) => {
    const success = await revokeAdmin(userId);
    if (success) {
      toast.success('Admin privileges revoked');
      setMembers(members.map(m => 
        m.id === userId ? {...m, role: 'user'} : m
      ));
    } else {
      toast.error('Failed to revoke admin');
    }
  };

  if (loading) return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-gold-accent mb-4">Members</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
              {userRole === 'admin' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-gray-750">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {member.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {member.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.role === 'admin' 
                      ? 'bg-purple-800 text-purple-100' 
                      : 'bg-blue-800 text-blue-100'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {member.createdAt?.toLocaleDateString() || 'N/A'}
                </td>
                {userRole === 'admin' && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {member.role === 'admin' ? (
                      <button
                        onClick={() => handleRevokeAdmin(member.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Revoke Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(member.id)}
                        className="text-green-500 hover:text-green-700 text-xs font-medium"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}