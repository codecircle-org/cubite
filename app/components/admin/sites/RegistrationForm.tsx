"use client";

import { Site } from "@prisma/client";
import React, { useState } from "react";
import toast from "react-hot-toast";

function RegistrationForm({ site }: { site: Site }) {
  const [formTitle, setFormTitle] = useState(site?.registrationForm?.title);
  const [formDescription, setFormDescription] = useState(
    site?.registrationForm?.description
  );
  const [secondaryFormTitle, setSecondaryFormTitle] = useState(
    site?.registrationForm?.secondaryTitle
  );
  const [secondaryFormDescription, setSecondaryFormDescription] = useState(
    site?.registrationForm?.secondaryDescription
  );
  const [formButtonText, setFormButtonText] = useState(
    site?.registrationForm?.buttonText
  );
  const [registrationFormVisible, setRegistrationFormVisible] = useState(
    site?.registrationFormVisible
  );

  const handleFormTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
  };

  const handleFormDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormDescription(e.target.value);
  };

  const handleSecondaryFormTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSecondaryFormTitle(e.target.value);
  };

  const handleSecondaryFormDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSecondaryFormDescription(e.target.value);
  };

  const handleFormButtonTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormButtonText(e.target.value);
  };

  const handleRegistrationFormVisible = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const response = await fetch(`/api/site/${site.domainName}`, {
      method: "PUT",
      body: JSON.stringify({
        siteId: site.id,
        updateData: {
          registrationFormVisible: e.target.checked,
        },
      }),
    });
    const data = await response.json();
    if (data.status === 200) {
      setRegistrationFormVisible(data.site.registrationFormVisible);
      toast.success("Registration form visibility updated");
    } else {
      toast.error("Failed to update registration form visibility");
    }
  };

  const handleUpdateForm = async () => {
    const result = await fetch(
      `/api/site/${site.domainName}/registrationForm`,
      {
        method: "PUT",
        body: JSON.stringify({
          siteId: site.id,
          registrationForm: {
            title: formTitle,
            description: formDescription,
            secondaryTitle: secondaryFormTitle,
            secondaryDescription: secondaryFormDescription,
            buttonText: formButtonText,
          },
        }),
      }
    );
  };

  return (
    <div className="w-full space-y-4 mb-8 border-2 border-dashed border-gray-100 p-4">
      <h3 className="font-medium">Registration Form</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <label className="form-control w-full min-w-xs">
            <div className="label">
              <span className="label-text">Form Title</span>
            </div>
            <input
              type="text"
              placeholder="Create an Account"
              className="input input-bordered w-full max-w-xs"
              onChange={handleFormTitleChange}
              onBlur={handleUpdateForm}
              value={formTitle}
            />
          </label>
        </div>
        <div className="col-span-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Form Description</span>
            </div>
            <input
              type="text"
              placeholder="Please fill this form to create your account"
              className="input input-bordered w-full max-w-lg"
              onChange={handleFormDescriptionChange}
              onBlur={handleUpdateForm}
              value={formDescription}
            />
          </label>
        </div>
        <div className="col-span-1">
          <label className="form-control w-full min-w-xs">
            <div className="label">
              <span className="label-text">Secondary Title</span>
            </div>
            <input
              type="text"
              placeholder="Join students from all over the world"
              className="input input-bordered w-full max-w-xs"
              onChange={handleSecondaryFormTitleChange}
              onBlur={handleUpdateForm}
              value={secondaryFormTitle}
            />
          </label>
        </div>
        <div className="col-span-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Secondary Description</span>
            </div>
            <input
              type="text"
              placeholder="We have a wide range of courses for you to choose from."
              className="input input-bordered w-full max-w-lg"
              onChange={handleSecondaryFormDescriptionChange}
              onBlur={handleUpdateForm}
              value={secondaryFormDescription}
            />
          </label>
        </div>
        <div className="col-span-1">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Button Text</span>
            </div>
            <input
              type="text"
              placeholder="Create an Account"
              className="input input-bordered w-full max-w-lg"
              onChange={handleFormButtonTextChange}
              onBlur={handleUpdateForm}
              value={formButtonText}
            />
          </label>
        </div>
        <div className="col-span-1 place-self-end">
          <label className="label cursor-pointer gap-4">
            <span className="label-text">Show registration form</span>
            <input
              type="checkbox"
              className="toggle border-primary"
              defaultChecked={site?.registrationFormVisible}
              onChange={handleRegistrationFormVisible}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
