"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";

const Profile = () => {
  const { status, data: session } = useSession();
  const [studentData, setStudentData] = useState({});

  const renderAvatar = (open) => {
    if (studentData.image) {
      return (
        <div className="avatar">
          <div className="w-48 h-48 rounded-xl">
            <CldImage
              fill
              className="rounded-full"
              src={studentData.image ? studentData.image : ""}
              onClick={() => open()}
              sizes="100vw"
              alt="Description of my image"
            />
          </div>
        </div>
      );
    } else if (session?.user?.name) {
      const initial = session.user.name.charAt(0).toUpperCase();
      return (
        <span className="inline-block h-48 w-48 overflow-hidden rounded-full bg-gray-100">
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      );
    } else {
      return <div className="w-10 h-10 rounded-full bg-gray-300"></div>;
    }
  };

  const updateStudent = async (updateData) => {
    const { name, image, username, email, extraInfo } = updateData; // Filter only relevant fields
    const filteredData = { name, image, username, email, extraInfo }; // Create a new object with filtered fields

    const response = await fetch(`/api/student/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredData),
    });
    const result = await response.json();
  };

  const handleImage = (imageSrc) => {
    setStudentData((prevState) => {
      const updatedData = { ...prevState, image: imageSrc };
      updateStudent(updatedData);
      return updatedData;
    });
  };

  const handleName = (e) => {
    const updatedName = e.target.value;
    setStudentData((prevState) => {
      const updatedData = { ...prevState, name: updatedName };
      updateStudent(updatedData);
      return updatedData;
    });
  };

  const handleEmail = (e) => {
    const updatedEmail = e.target.value;
    setStudentData((prevState) => {
      const updatedData = { ...prevState, email: updatedEmail };
      updateStudent(updatedData);
      return updatedData;
    });
  };

  const handleUsername = (e) => {
    const updatedUsername = e.target.value;
    setStudentData((prevState) => {
      const updatedData = { ...prevState, username: updatedUsername };
      updateStudent(updatedData);
      return updatedData;
    });
  };

  const handleExtraInfo = (e) => {
    setStudentData((prevState) => {
      const updatedData = {
        ...prevState,
        extraInfo: {
          ...prevState.extraInfo,
          [e.target.id]: e.target.value,
        },
      };
      updateStudent(updatedData);
      return updatedData;
    });
  };

  useEffect(() => {
    const getStudentData = async () => {
      const response = await fetch("/api/student", {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status === 200) {
        setStudentData(result.student);
      }
    };
    getStudentData();
  }, []);

  return (
    <div className="">
      <div className="grid grid-rows-3 grid-flow-col my-16">
        <div className="row-span-3 mx-auto self-center">
          <CldUploadWidget
            uploadPreset="dtskghsx"
            options={{
              multiple: false,
              cropping: true,
            }}
            onSuccess={(results, options) => {
              handleImage(results.info?.public_id);
            }}
          >
            {({ open }) => {
              return (
                <button onClick={() => open()}>{renderAvatar(open)}</button>
              );
            }}
          </CldUploadWidget>
        </div>
        <div className="col-span-2 text-4xl font-bold self-center">
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={studentData.name}
            onChange={handleName}
            className="bg-transparent"
          />
        </div>
        <div className="col-span-2">
          <div className="">
            <span className="text-sm font-bold mx-2">Email</span>
            <input
              readOnly
              type="text"
              name="email"
              id="email"
              defaultValue={studentData.email}
              onChange={handleEmail}
              className="bg-transparent"
            />
          </div>
          <div className="">
            <span className="text-sm font-bold mx-2">Username</span>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={studentData.username}
              onChange={handleUsername}
              className="bg-transparent"
            />
          </div>
          <div className="">
            {studentData.extraInfo &&
              Object.entries(studentData.extraInfo).map(([key, value]) => (
                <div key={key} className="">
                  <span className="text-sm font-bold mx-2">{key}</span>
                  <input
                    type="text"
                    name={key}
                    id={key}
                    defaultValue={value}
                    onChange={handleExtraInfo}
                    className="bg-transparent"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
