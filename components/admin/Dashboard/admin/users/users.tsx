"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Pencil, Trash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  isBlacklisted: boolean;
};

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [filterBlacklist, setFilterBlacklist] = useState("all");
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      isBlacklisted: false,
    },
    {
      id: 2,
      name: "Alice Smith",
      email: "alice@example.com",
      username: "alicesmith",
      isBlacklisted: true,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      username: "bobjohnson",
      isBlacklisted: false,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  // const [isBlacklisted, setIsBlacklisted] = useState(user.isBlacklisted);

  const handleConfirm = (user: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, isBlacklisted: !u.isBlacklisted } : u
      )
    );
    setIsOpen(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
  });

  // Filter users based on search input and blacklist filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesBlacklist =
      filterBlacklist === "all" ||
      (filterBlacklist === "blacklisted" && user.isBlacklisted) ||
      (filterBlacklist === "not_blacklisted" && !user.isBlacklisted);
    return matchesSearch && matchesBlacklist;
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Add User Function
  const handleAddUser = () => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setNewUser({ name: "", email: "", username: "", isBlacklisted: false });
    setIsAddOpen(false);
  };

  // Edit User Function
  const handleEditUser = () => {
    setUsers(
      users.map((user) =>
        user.id === selectedUser?.id ? { ...selectedUser } : user
      )
    );
    setIsEditOpen(false);
  };

  // Delete User Function
  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser?.id));
    setIsDeleteOpen(false);
  }

  return (
    <div className="h-fit bg-gradient-to-br text- dark:text-white p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-col gap-2">
            <Breadcrumb className="text-gray-400" aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/admin/dashboard/overview"
                    className="text-black/80 dark:text-gray-400"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-black/50 dark:text-gray-400"
                    href="/admin/dashboard/admin-config"
                  >
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black/50 dark:text-gray-400">
                    Users
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold text-black/90 dark:text-gray-100">
              User Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage all users.
            </p>
          </div>
        </div>
      </div>
      {/* Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="relative flex gap-2">
            <Input
              placeholder="Search users..."
              className="w-2/3 bg-black text-white border border-teal-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              variant="outline"
              onClick={toggleFilter}
              className="bg-black text-teal-600 hover:bg-teal-600 hover:text-white border-teal-600 justify-end "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </Button>
          </div>

          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="mr-2" /> Add User
          </Button>
        </div>

        {/* Filter Section */}
        {isFilterOpen && (
          <div className="bg-black p-4 rounded-lg flex flex-col space-y-4 w-full border border-teal-600 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <Select onValueChange={setFilterBlacklist} defaultValue="all">
              <SelectTrigger className="w-48 bg-black text-white border border-teal-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-teal-600">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="blacklisted">Blacklisted</SelectItem>
                <SelectItem value="not_blacklisted">Not Blacklisted</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-end w-full  justify-end">
              <Button className="bg-teal-600 hover:bg-teal-500">
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <Table className="border border-teal-600">
          <TableHeader className="rounded-t-2xl">
            <TableRow className="bg-black rounded-t-2xl">
              <TableHead className="border-b border-teal-600">ID</TableHead>
              <TableHead className="border-b border-teal-600">Name</TableHead>
              <TableHead className="border-b border-teal-600">Email</TableHead>
              <TableHead className="border-b border-teal-600">
                Blacklisted
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="border-b border-teal-600 bg-black/60 hover:bg-black/15"
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                <Checkbox
                  checked={user.isBlacklisted}
                  onCheckedChange={() => {
                    setSelectedUser(user);
                    setIsOpen(true);
                  }}
                />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for confirmation */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black text-white border-teal-600">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isBlacklisted
                ? "Remove from Blacklist?"
                : "Blacklist this User?"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedUser && handleConfirm(selectedUser)} className="bg-teal-600 hover:bg-teal-500 text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-black text-white border-teal-600">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <p>Name: {selectedUser?.name}</p>
          <p>Email: {selectedUser?.email}</p>
          <p>Username: {selectedUser?.username}</p>
          <p>Blacklisted: {selectedUser?.isBlacklisted ? "Yes" : "No"}</p>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-black text-white border-teal-600">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Input
            className=" border-teal-600"
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser!, name: e.target.value })
            }
          />
          <Button
            onClick={handleEditUser}
            className="bg-teal-600 hover:bg-teal-500"
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-black text-white border-teal-600">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedUser?.name}?</p>
          <Button
            onClick={handleDeleteUser}
            className="bg-black border border-red-700 hover:bg-red-700 "
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-black text-white border-teal-600">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <Label className="text-white">Name</Label>
          <Input
            className="border-teal-600"
            placeholder="Name"
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <Label className="text-white">Email</Label>
          <Input
            className="border-teal-600"
            placeholder="Email"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Label className="text-white">Username</Label>
          <Input
            className="border-teal-600"
            placeholder="Username"
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <Button
            onClick={handleAddUser}
            className="bg-teal-600 hover:bg-teal-500"
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
