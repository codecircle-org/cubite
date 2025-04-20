"use client";

import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { CldImage } from "next-cloudinary";
import LiftedTab from "@/app/components/admin/sites/LiftedTab";
import toast from "react-hot-toast";

interface Site {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  domainName: string;
  customDomain?: string;
  isActive: boolean;
  languages: string[];
  openedxSiteUrl: string;
  admins: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  siteRoles?: {
    id: string;
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    image?: string;
  }[];
  openedxLtiConsumerKey?: string;
  openedxLtiConsumerSecret?: string;
  openedxOauthClientId?: string;
  openedxOauthClientSecret?: string;
}

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  username: string;
  createdAt: Date;
}

function MembersTab({ site }: { site: Site }) {
  const [members, setMembers] = useState<Member[]>(site.siteRoles || []);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleAddMember = async () => {
    const newMember = {
      siteId: site.id,
      username: newUsername,
      name: newName,
      email: newEmail,
      role: newRole,
    };
    const response = await fetch(`/api/site/${site.domainName}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMember),
    });
    const result = await response.json();
    if (result.status === 200) {
      setMembers([...members, result.siteRole]);
      toast.success("Member added successfully");
    } else {
      console.error("Failed to add member:", result.message);
      toast.error(result.message);
    }
  };

  const handleRoleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    userId: string,
    siteId: string
  ) => {
    const changedRole = e.target.value;
    const response = await fetch(`/api/site/${site.domainName}/members`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        siteId,
        newRole: changedRole,
      }),
    });
    const result = await response.json();
    if (result.status === 200) {
      toast.success("Role updated successfully");
      const updatedMembers = members.map((member) =>
        member.userId === userId ? { ...member, role: changedRole } : member
      );
      setMembers(updatedMembers);
    } else {
      toast.error(result.message);
    }
  };

  const handleMemberDeletion = async (userId: string, siteId: string) => {
    const response = await fetch(`/api/site/${site.domainName}/members`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        siteId,
      }),
    });
    const result = await response.json();
    if (result.status === 200) {
      setMembers(members.filter((member) => member.userId !== userId));
    } else {
      console.error("Failed to delete member:", result.message);
    }
  };
  return (
    <>
      <LiftedTab tabName="Members">
        {members.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="my-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="btn btn-outline btn-ghost"
                onClick={() =>
                  document.getElementById("add_member").showModal()
                }
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Add Member
              </button>
            </div>

            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Registration Date</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.userId}>
                    <td className="">
                      {member.user.image ? (
                        <CldImage
                          width={250}
                          height={250}
                          className="w-12 h-12 rounded-full"
                          src={member.user.image}
                          onClick={() => open()}
                          alt={member.user.name}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>{member.user.name}</td>
                    <td>{member.user.email}</td>
                    <td>{member.user.username}</td>
                    <td>
                      {new Date(member.user.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </td>
                    <td>
                      <select
                        className="select select-bordered max-w-x"
                        value={member.role}
                        onChange={(e) => {
                          handleRoleChange(e, member.userId, site.id);
                        }}
                      >
                        <option value="MANAGER">MANAGER</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                        <option value="STUDENT">STUDENT</option>
                      </select>
                    </td>
                    <td>
                      <div
                        className="btn btn-outline btn-error"
                        onClick={() =>
                          handleMemberDeletion(member.userId, site.id)
                        }
                      >
                        <TrashIcon className="h-5 w-6" aria-hidden="true" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="">
            <div>
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h2 className="mt-2 text-base font-semibold leading-6">
                  Add Members
                </h2>
                <p className="mt-1 text-sm ">
                  You haven't added any members to your site yet. You can add
                  Students, Instructors and Managers to your site.
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-ghost mt-4"
                  onClick={() =>
                    document.getElementById("add_member").showModal()
                  }
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add a new member modal */}
        <dialog id="add_member" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add a new Member to the Site</h3>
            <div className="">
              <form method="dialog">
                <label className="input input-bordered flex items-center gap-2 my-4">
                  Name:
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="grow"
                    placeholder="John Doe"
                    required
                    minLength={6}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 my-4">
                  Email:
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="grow"
                    placeholder="john@example.com"
                    required
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 my-4">
                  Username:
                  <input
                    type="text"
                    className="grow"
                    placeholder="john.doe"
                    id="username"
                    name="username"
                    required
                    minLength={3}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  id="role"
                  name="role"
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Role
                  </option>
                  <option value="MANAGER">Manager</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="STUDENT">Student</option>
                </select>

                <div className="modal-action">
                  <button className="btn btn-primary" onClick={handleAddMember}>
                    Save
                  </button>
                  <div
                    className="btn btn-outline"
                    onClick={() =>
                      document.getElementById("add_member").close()
                    }
                  >
                    Cancel
                  </div>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </LiftedTab>
    </>
  );
}

export default MembersTab;
