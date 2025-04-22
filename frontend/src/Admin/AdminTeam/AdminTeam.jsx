import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  UploadCloud,
  UserPlus,
  Edit,
  Trash,
  ShieldCheck,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { backendurl, imgurl } from '@/server';
import swal from 'sweetalert';

const AdminTeam = () => {
  const { adminUser } = useSelector((state) => state.adminAuth);
  const navigate = useNavigate();

  const [allAdmins, setAllAdmins] = useState([]);
  const [editAdmin, setEditAdmin] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      const response = await axios.get(`${backendurl}/admin/all-admins`, {
        withCredentials: true,
      });
      setAllAdmins(response.data);
    } catch (error) {
      toast.error('Failed to load admin users.');
    }
  };

  const handleUpdateAdmin = async (updatedAdmin) => {
    try {
      await axios.put(
        `${backendurl}/admin/update-admin/${updatedAdmin._id}`,
        updatedAdmin,
        { withCredentials: true }
      );
      toast.success('Admin updated successfully.');
      fetchAllAdmins();
    } catch (error) {
      toast.error('Failed to update admin.');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this admin account!',
      icon: 'warning',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`${backendurl}/admin/delete-admin/${adminId}`, {
            withCredentials: true,
          });
          toast.success('Admin deleted.');
          fetchAllAdmins();
        } catch (error) {
          toast.error('Failed to delete admin.');
        }
      }
    });
  };

  const getInitials = (name) => {
    const words = name?.split(' ');
    return words?.length > 1
      ? words[0][0] + words[1][0]
      : name?.substring(0, 2).toUpperCase();
  };

  const formatRole = (role) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderator';
      default:
        return 'Member';
    }
  };

  const roleColors = {
    superadmin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    moderator: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <div className="p-4 sm:p-6 space-y-8  mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Team Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your admin team and assign roles to streamline collaboration.
          </p>
        </div>

        {adminUser?.role === 'superadmin' && (
          <Button
            variant="outline"
            onClick={() => navigate('/admin-signup')}
            className="mt-2 sm:mt-0 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Team Member
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          All Admins
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allAdmins.map((admin) => (
            <div
              key={admin._id}
              className="flex flex-col items-center p-6 border rounded-2xl shadow-md bg-white dark:bg-neutral-900 dark:border-neutral-700 transition hover:shadow-lg "
            >
              {admin.avatar ? (
                <img
                  src={`${imgurl}${admin.avatar}`}
                  alt={admin.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-gray-200 dark:border-neutral-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-xl font-semibold text-gray-600 dark:text-gray-100 mb-4 border-4 border-gray-200 dark:border-neutral-700">
                  {getInitials(admin.name)}
                </div>
              )}

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {admin.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {admin.email}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded-full mt-2 font-medium ${
                  roleColors[admin.role] || 'bg-gray-200 text-gray-700'
                }`}
              >
                {formatRole(admin.role)}
              </span>

              {/* <p className="text-xs text-gray-400 mt-1">
                Joined {moment(admin.createdAt).format('DD MMM YYYY')}
              </p> */}

              <div className="mt-auto flex items-center gap-2 pt-3">
                {adminUser?.role === 'superadmin' && (
                  <>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditAdmin(admin);
                            setIsDialogOpen(true);
                          }}
                          className="hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                          <Edit size={18} className="text-gray-700 dark:text-gray-300 " />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[500px] dark:bg-neutral-900">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                            <ShieldCheck size={20} /> Edit Admin
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                          <Input
                            className="dark:bg-neutral-800 dark:text-white"
                            value={editAdmin?.name || ''}
                            onChange={(e) =>
                              setEditAdmin({ ...editAdmin, name: e.target.value })
                            }
                            placeholder="Name"
                          />
                          <Input
                            className="dark:bg-neutral-800 dark:text-white"
                            value={editAdmin?.email || ''}
                            onChange={(e) =>
                              setEditAdmin({ ...editAdmin, email: e.target.value })
                            }
                            placeholder="Email"
                          />
                          <Select
                            value={editAdmin?.role || ''}
                            onValueChange={(value) =>
                              setEditAdmin({ ...editAdmin, role: value })
                            }
                          >
                            <SelectTrigger className="dark:bg-neutral-800 dark:text-white">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-neutral-800 dark:text-white">
                              <SelectItem value="superadmin">Super Admin</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                          <Button
                            variant="ghost"
                            className="border dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800"
                            onClick={() => {
                              setEditAdmin(null);
                              setIsDialogOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-primary text-white hover:bg-primary/90 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                            onClick={() => {
                              handleUpdateAdmin(editAdmin);
                              setIsDialogOpen(false);
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer"
                      onClick={() => handleDeleteAdmin(admin._id)}
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTeam;
