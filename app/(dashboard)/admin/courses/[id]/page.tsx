"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import { CldUploadWidget } from "next-cloudinary";
import MultiInput from "@/app/components/MultiInput";
import MultiSelect from "@/app/components/MultiSelect";
import { useSession } from "next-auth/react";
import Alert from "@/app/components/Alert";
import { formatDateTime } from "@/app/utils/formatDateTime";
import DateTimeInput from "@/app/components/DateTimeInput";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import EmptyState from "@/app/components/admin/EmptyState";
// import Editor from "react-simple-wysiwyg";
import { LockKeyholeOpenIcon, LockOpenIcon, OctagonAlertIcon } from "lucide-react";
import openedxEnrollUser from "@/app/utils/openedxEnrollUser";
import toast from "react-hot-toast";
import Editor from "@/app/components/Editor";

interface Course {
  name: string;
  id: string;
  isVisibleInCatalog: boolean;
  isSyllabusVisible: boolean;
  requirements: {
    time: number;
    blocks: any[];
    version: string;
  };
  instructors: {
    user: {
      id: string;
      name: string;
    };
  };
}

interface Instructor {
  id: string;
  name: string;
}

interface AchievementRecordsTemplate {
  id: string;
  name: string;
  description: string;
  permalink: string;
  courseName: string;
  courseId: string;
  content: any;
}

const Course = ({ params: { id } }: { params: { id: string } }) => {
  const [course, setCourse] = useState<Course>();
  const [message, setMessage] = useState("");
  const [alertStatus, setStatus] = useState(0);
  const [instructors, setInstructors] = useState<Instructor[]>();
  const [enrollments, setEnrollments] = useState([]);
  const [waitListedEnrollments, setWaitListedEnrollments] = useState([]);
  const [possibleInstructors, setPossibleInstructors] = useState<Instructor[]>(
    []
  );
  const [requirements, setRequirements] = useState<any>({});
  const [addEnrollmentStatus, setAddEnrollmentStatus] = useState(0);
  const [addEnrollmentMessage, setAddEnrollmentMessage] = useState("");
  const [enrollmentExpiration, setEnrollmentExpiration] = useState();
  const { status, data: session } = useSession();
  const [sites, setSites] = useState([]);
  const [achievementRecordsTemplates, setAchievementRecordsTemplates] =
    useState<AchievementRecordsTemplate[]>([]);

  useEffect(() => {
    if (!session) return;
    const getCourseData = async (id: string) => {
      const response = await fetch(`/api/course/${id}`, {
        cache: "no-store",
      });
      if (response.status === 200) {
        const { course } = await response.json();
        const instructors = course.instructors.map((instructor) => ({
          name: instructor.user.name,
          id: instructor.user.id,
        }));
        course.instructors = instructors;
        setCourse(course);
        setInstructors(instructors);
        setRequirements(course.requirements);
      }
    };
    async function getInstructor() {
      const response = await fetch("/api/instructors", {
        cache: "no-store",
      });
      if (response.status === 200) {
        const result = await response.json();
        const possibleInstructors = await result.instructors;
        setPossibleInstructors(possibleInstructors);
      }
    }
    async function getMysites(email: string) {
      try {
        const response = await fetch("/api/site/mysites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
          }),
        });
        const result = await response.json();
        if (result.status === 200) {
          setSites(result.sites);
        }
      } catch (err) {
        console.log(err);
      }
    }
    async function fetchEnrollments(courseId: string) {
      const response = await fetch(`/api/enrollments/${courseId}`, {
        cache: "no-store",
      });
      const result = await response.json();
      if (result.status == 200) {
        const nonWaitListedEnrollments = result.enrollments.filter(
          (enrollment) => !enrollment.isWaitListed
        );
        const waitListedEnrollments = result.enrollments.filter(
          (enrollment) => enrollment.isWaitListed
        );
        setEnrollments(nonWaitListedEnrollments);
        setWaitListedEnrollments(waitListedEnrollments);
      } else {
        setMessage(result.message);
        setStatus(result.status);
      }
    }
    getCourseData(id);
    getInstructor();
    getMysites(session?.user?.email);
    fetchEnrollments(id);
  }, [id, session]);

  const handleCourseImage = useCallback((imageSrc: string) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      coverImage: imageSrc,
    }));
  }, []);

  const handleCourseName = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      name: e.target.value,
    }));
  }, []);

  const handleCourseDescription = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      description: e.target.value,
    }));
  }, []);

  const handleCourseBanner = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      banner: e.target.value,
    }));
  }, []);

  const handleWaitListMessage = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      waitListMessage: e.target.value,
    }));
  }, []);

  const handleIsWaitList = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      isWaitList: e.target.checked,
    }));
    if (!e.target.checked) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <OctagonAlertIcon className="h-6 w-6 text-warning" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Please Unlock waitlisted users
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  In the <strong>Waitlist</strong> tab, Click on the
                  <strong>"Bulk Enroll"</strong> button to unlock waitlisted
                  users
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  }, []);

  const handleIsOnDemand = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      isOnDemand: e.target.checked,
    }));
  }, []);

  const handleIsVisibleInCatalog = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      isVisibleInCatalog: e.target.checked,
    }));
  }, []);

  const handleIsSyllabusVisible = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      isSyllabusVisible: e.target.checked,
    }));
  }, []);

  const handleSubjects = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      subjects: options,
    }));
  }, []);

  const handleTopics = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      topics: options,
    }));
  }, []);

  const handleInstructors = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      instructors: options,
    }));
  }, []);

  const handleSites = useCallback((options) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      sites: options,
    }));
  }, []);

  const handleLevel = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      level: e.target.value,
    }));
  }, []);

  const handlePrice = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      price: parseFloat(e.target.value),
    }));
  }, []);

  const handleXp = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      xp: parseFloat(e.target.value),
    }));
  }, []);

  const handleDuration = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      duration: parseInt(e.target.value),
    }));
  }, []);

  const handleStartDate = useCallback((startDate) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      startDate,
    }));
  }, []);

  const handleEndDate = useCallback((endDate) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      endDate,
    }));
  }, []);

  const handleCertificateTitle = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      certificateTitle: e.target.value,
    }));
  }, []);

  const handleCertificateDescription = useCallback((e) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      certificateDescription: e.target.value,
    }));
  }, []);

  const handleCertificateBackground = useCallback(
    (certificateBackgroundSrc) => {
      setCourse((prevCourse) => ({
        ...prevCourse,
        certificateBackground: certificateBackgroundSrc,
      }));
    },
    []
  );

  const handleRequirements = useCallback((content) => {
    setRequirements(content);
  }, []);

  const handleAddEnrollmentSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const enrollmentData = {
      courseId: course.id,
      name: formData.get("name"),
      email: formData.get("email"),
      username: formData.get("username"),
      siteId: formData.get("siteId"),
      expiresAt: enrollmentExpiration,
    };
    const response = await fetch(`/api/enrollments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollmentData),
    });

    const result = await response.json();
    if (result.status === 201) {
      setEnrollments([...enrollments, result.enrollment]);
      document.getElementById("add_enrollment").close();
    }
    setAddEnrollmentStatus(result.status);
    setAddEnrollmentMessage(result.message);
  };

  const handleEnrollmentExpiration = useCallback((expirationDate) => {
    setEnrollmentExpiration(expirationDate);
  }, []);

  const handleUpdateEnrollmentExpiration = async (enrollment, expiresAt) => {
    const response = await fetch(`/api/enrollments/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        siteId: enrollment.siteId,
        expiresAt: expiresAt,
      }),
    });

    const result = await response.json();
    setStatus(result.status);
    setMessage(result.message);
  };

  const handleEnrollmentStatus = async (enrollment, status) => {
    const response = await fetch(`/api/enrollments/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        siteId: enrollment.siteId,
        status: status,
      }),
    });

    const result = await response.json();
    if (result.status === 200) {
      toast.success("Enrollment status updated successfully");
      const updatedEnrollments = enrollments.map((e) => {
        const enrollmentKey = `${e.userId}-${e.siteId}-${e.courseId}`;
        const updatedEnrollmentKey = `${enrollment.userId}-${enrollment.siteId}-${enrollment.courseId}`;
        return enrollmentKey === updatedEnrollmentKey
          ? { ...e, status: status }
          : e;
      });
      setEnrollments(updatedEnrollments);
    } else {
      toast.error("Failed to update enrollment status");
    }
  };

  const handleUnlockEnrollment = async (enrollment) => {
    if (enrollment.course.externalId) {
      const openedxEnrollmentResult = await openedxEnrollUser(
        enrollment.site,
        enrollment.course,
        enrollment.user.email
      );
    }
    const response = await fetch(`/api/enrollments/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: enrollment.courseId,
        userId: enrollment.userId,
        siteId: enrollment.siteId,
        isWaitListed: false,
        status: "pending",
        enrolledInOpenedxCourse: enrollment.course.externalId ? true : false,
      }),
    });
    const result = await response.json();
    if (result.status === 200) {
      setWaitListedEnrollments(
        waitListedEnrollments.filter((e) => {
          const enrollmentKey = `${e.userId}-${e.siteId}-${e.courseId}`;
          const updatedEnrollmentKey = `${enrollment.userId}-${enrollment.siteId}-${enrollment.courseId}`;

          return enrollmentKey !== updatedEnrollmentKey;
        })
      );
      setEnrollments([...enrollments, enrollment]);
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site: enrollment.site,
          course: enrollment.course,
          userFirstname: enrollment.user.name,
          to: enrollment.user.email,
          subject: `A Spot is Available in ${enrollment.course.name} – Enroll Now!`,
          type: "openEnrollmentStop",
        }),
      });
    }
  };

  const handleBulkEnroll = async () => {
    waitListedEnrollments.map(async (enrollment) => {
      await handleUnlockEnrollment(enrollment);
    });
  };

  const handleCourseSave = async () => {
    if (!course) return;

    const response = await fetch(`/api/course/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...course,
        requirements: requirements,
      }),
    });
    const result = await response.json();
    setStatus(result.status);
    setMessage(result.message);
  };

  const handleDeleteEnrollment = async (selectedEnrollment) => {
    const response = await fetch(`/api/enrollments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: selectedEnrollment.courseId,
        userId: selectedEnrollment.userId,
        siteId: selectedEnrollment.siteId,
      }),
    });

    const result = await response.json();

    if (result.status === 200) {
      setEnrollments(
        enrollments.filter(
          (enrollment) => enrollment.userId !== selectedEnrollment.userId
        )
      );
      setWaitListedEnrollments(
        waitListedEnrollments.filter(
          (enrollment) => enrollment.userId !== selectedEnrollment.userId
        )
      );
    } else {
      console.error(result.message);
    }
    setStatus(result.status);
    setMessage(result.message);
  };

  const handleCreateAchievementRecordsTemplate = () => {
    const newTemplate: AchievementRecordsTemplate = {
      id: Math.random().toString(36).substring(2, 18),
      name: "New Template",
      description: "New Template Description",
      permalink: "new-template",
      courseName: course?.name || "",
      content: "Write your content here...",
      courseId: course?.id || "",
    };
    setAchievementRecordsTemplates([
      ...achievementRecordsTemplates,
      newTemplate,
    ]);
  };

  const handleDeleteAchievementRecordsTemplate = (templateId: string) => {
    setAchievementRecordsTemplates(
      achievementRecordsTemplates.filter(
        (template) => template.id !== templateId
      )
    );
  };

  const handleTemplateName = (e) => {
    setAchievementRecordsTemplates((prevTemplates) =>
      prevTemplates.map((template) => ({
        ...template,
        name: e.target.value,
      }))
    );
  };

  const handleTemplatePermalink = (e) => {
    setAchievementRecordsTemplates((prevTemplates) =>
      prevTemplates.map((template) => ({
        ...template,
        permalink: e.target.value,
      }))
    );
  };

  const handleTemplateDescription = (e) => {
    setAchievementRecordsTemplates((prevTemplates) =>
      prevTemplates.map((template) => ({
        ...template,
        description: e.target.value,
      }))
    );
  };

  const handleTemplateContent = (e) => {
    setAchievementRecordsTemplates((prevTemplates) =>
      prevTemplates.map((template) => ({
        ...template,
        content: e.target.value,
      }))
    );
  };

  return (
    <>
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course?.name}</h1>
            <p className="text-sm text-gray-500">
              Created at{" "}
              {course?.createdAt && formatDateTime(course?.createdAt)}
            </p>
            <p className="text-sm text-gray-500">
              Updated at{" "}
              {course?.updatedAt && formatDateTime(course?.updatedAt)}
            </p>

            <p className="mt-2">
              Fill the following information to create a new course.
            </p>
          </div>
          <div>
            <Link
              className="btn mx-2 btn-outline btn-ghost"
              href={`/admin/content-authoring/course/${id}`}
            >
              Content Authoring
            </Link>
            <button className="btn btn-primary" onClick={handleCourseSave}>
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <Alert
        status={alertStatus}
        message={message}
        onClose={() => {
          setStatus(0), setMessage("");
        }}
      />
      {course && (
        <div className="">
          <div role="tablist" className="tabs tabs-boxed mt-8 grid grid-cols-5">
            <input
              type="radio"
              name="course_details"
              role="tab"
              className="tab"
              aria-label="Details"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6 mb-8"
            >
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" defaultChecked />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  General Information
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <label className="form-control w-full max-w-full">
                        <div className="label">
                          <span className="label-text">Course Name</span>
                        </div>
                        <input
                          type="text"
                          id="courseName"
                          name="courseName"
                          placeholder={course?.name}
                          defaultValue={course?.name}
                          className="input input-bordered w-full max-w-full"
                          onChange={handleCourseName}
                        />
                        <div className="label">
                          <span className="label-text-alt">
                            Change Course Name
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="col-span-full">
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text">Course Description</span>
                          <span className="label-text-alt">
                            {course?.description?.length || 0}/401 characters
                          </span>
                        </div>
                        <textarea
                          className="textarea textarea-bordered h-24"
                          placeholder="This course is about ...."
                          defaultValue={course?.description}
                          onChange={(e) => {
                            if (e.target.value.length <= 401) {
                              handleCourseDescription(e);
                            } else {
                              e.target.value = e.target.value.slice(0, 401);
                            }
                          }}
                          maxLength={401}
                        ></textarea>
                        <div className="label">
                          <span className="label-text-alt">
                            Write some description about this course
                          </span>
                          {course?.description?.length === 401 && (
                            <span className="label-text-alt text-error">
                              Character limit reached
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">Level</span>
                        </div>
                        <select
                          className="select select-bordered"
                          onChange={handleLevel}
                          defaultValue={
                            course.level ? course.level : "Beginner"
                          }
                        >
                          <option disabled>Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <div className="label">
                          <span className="label-text-alt">
                            Change Course Level
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">Price</span>
                        </div>
                        <input
                          type="text"
                          id="courseName"
                          name="courseName"
                          placeholder={course?.price}
                          defaultValue={course?.price}
                          className="input input-bordered w-full max-w-xs"
                          onChange={handlePrice}
                        />
                        <div className="label">
                          <span className="label-text-alt">
                            Change Course Price - USD
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">XP</span>
                        </div>
                        <input
                          type="text"
                          id="courseXp"
                          name="courseXp"
                          placeholder={course?.xp}
                          defaultValue={course?.xp}
                          className="input input-bordered w-full max-w-xs"
                          onChange={handleXp}
                        />
                        <div className="label">
                          <span className="label-text-alt">Change XP</span>
                        </div>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="form-control w-full max-w-xs">
                        <div className="label">
                          <span className="label-text">Course Duration</span>
                        </div>
                        <input
                          type="number"
                          id="courseDuration"
                          name="courseDuration"
                          placeholder={course?.duration ? course?.duration : 1}
                          defaultValue={course?.duration}
                          className="input input-bordered w-full max-w-xs"
                          onChange={handleDuration}
                        />
                        <div className="label">
                          <span className="label-text-alt">
                            Course Duration in Hours
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  Schedule and Dates
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <DateTimeInput
                    title="Course Start Date"
                    onChange={handleStartDate}
                    defaultValue={course?.startDate}
                  />
                  <DateTimeInput
                    title="Course End Date"
                    onChange={handleEndDate}
                    defaultValue={course?.endDate}
                  />
                </div>
              </div>
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  Access and Visibility
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 place-items-start">
                    <div className="w-full sm:col-span-full border-2 border-dotted border-base-200 p-4 mt-2">
                      <MultiSelect
                        title={"Sites"}
                        onChange={handleSites}
                        options={sites}
                        preSelectedOptions={course?.sites}
                      />
                    </div>
                    <div className="form-control w-full sm:col-span-full self-center border-2 border-dotted border-base-200 p-4">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          Is this a waitlist course?
                        </span>
                        <input
                          type="checkbox"
                          className="toggle border-primary"
                          defaultChecked={course?.isWaitList}
                          onChange={handleIsWaitList}
                        />
                      </label>
                      <span className="text-xs pt-2">
                        For waitlist course users still can enroll but they
                        should wait until you unlock the course
                      </span>
                    </div>
                    {course?.isWaitList && (
                      <div className="col-span-full w-full border-2 border-dotted border-base-200 p-4">
                        <label className="form-control w-full max-w-full">
                          <div className="label">
                            <span className="label-text">Waitlist Message</span>
                          </div>
                          <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="This course is about ...."
                            defaultValue={course?.waitListMessage}
                            onChange={handleWaitListMessage}
                          ></textarea>
                          <div className="label">
                            <span className="label-text-alt">
                              Add a message to the course card for the users
                              that want to enroll in the course
                            </span>
                          </div>
                        </label>
                      </div>
                    )}
                    <div className="form-control w-full sm:col-span-full self-center border-2 border-dotted border-base-200 p-4">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          Is this an on demand course?
                        </span>
                        <input
                          type="checkbox"
                          className="toggle border-primary"
                          defaultChecked={course?.isOnDemand}
                          onChange={handleIsOnDemand}
                        />
                      </label>
                      <span className="text-xs pt-2">
                        Users can enroll and start the course immediately
                        without the need for a start date.
                        <span className="text-xs pt-2 text-error">
                          {course?.isWaitList &&
                            " This course is marked as waitlist, Users can't access the course until it starts."}
                        </span>
                      </span>
                    </div>
                    <div className="form-control w-full sm:col-span-full self-center border-2 border-dotted border-base-200 p-4">
                      <label className="label cursor-pointer">
                        <span className="label-text">Visible in Catalog</span>
                        <input
                          type="checkbox"
                          className="toggle border-primary"
                          defaultChecked={course?.isVisibleInCatalog}
                          onChange={handleIsVisibleInCatalog}
                        />
                      </label>
                      <span className="text-xs pt-2">
                        If you want to hide the course from the catalog, you can
                        uncheck this option
                      </span>
                    </div>
                    <div className="form-control w-full sm:col-span-full self-center border-2 border-dotted border-base-200 p-4">
                      <label className="label cursor-pointer">
                        <span className="label-text">Syllabus is Visible</span>
                        <input
                          type="checkbox"
                          className="toggle border-primary"
                          defaultChecked={course?.isSyllabusVisible}
                          onChange={handleIsSyllabusVisible}
                        />
                      </label>
                      <span className="text-xs pt-2">
                        If you want to hide the syllabus from the course, you
                        can uncheck this option
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  Instructors
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <MultiSelect
                    title={"Instructors"}
                    onChange={handleInstructors}
                    options={possibleInstructors}
                    preSelectedOptions={instructors}
                  />
                </div>
              </div>
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  Media and Visuals
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6"
                    >
                      Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dotted px-6 py-10">
                      <div className="text-center">
                        <CldImage
                          width={500}
                          height={500}
                          src={
                            course?.coverImage
                              ? course.coverImage
                              : "photo-1715967635831-f5a1f9658880_mhlqwu"
                          }
                          alt="Description of my image"
                        />
                        <div className="mt-4 flex text-sm leading-6">
                          <CldUploadWidget
                            uploadPreset="dtskghsx"
                            options={{
                              multiple: false,
                            }}
                            onSuccess={(results, options) => {
                              handleCourseImage(results.info?.public_id);
                            }}
                          >
                            {({ open }) => {
                              return (
                                <button
                                  className="btn btn-outline btn-secondary"
                                  onClick={() => open()}
                                >
                                  Upload an Image
                                </button>
                              );
                            }}
                          </CldUploadWidget>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Course Banner</span>
                      </div>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="This course is about ...."
                        defaultValue={course?.banner}
                        onChange={handleCourseBanner}
                      ></textarea>
                      <div className="label">
                        <span className="label-text-alt">
                          If you want to communicate an important message to
                          your students of this course, you can write it here.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  Requirements
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <div className="">
                    <Editor
                      savedContent={course?.requirements}
                      onChange={handleRequirements}
                    />
                  </div>
                </div>
              </div>
              <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" />
                <div className="collapse-title text-xl font-medium bg-base-200">
                  Tags
                </div>
                <div className="collapse-content border-2 mb-2 border-base-200">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <MultiInput
                      title={"Subjects"}
                      onChange={handleSubjects}
                      preSelectedOptions={course?.subjects}
                    />
                    <MultiInput
                      title={"Topics"}
                      onChange={handleTopics}
                      preSelectedOptions={course?.topics}
                    />
                  </div>
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="course_details"
              role="tab"
              className="tab"
              aria-label="Certificate Template"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8  sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Certificate Title</span>
                    </div>
                    <input
                      type="text"
                      id="certificateTitle"
                      name="certificateTitle"
                      placeholder={course?.certificateTitle}
                      defaultValue={course?.certificateTitle}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleCertificateTitle}
                    />
                    <div className="label">
                      <span className="label-text-alt">
                        Title to show in the certificate
                      </span>
                    </div>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
                        Certificate Description
                      </span>
                    </div>
                    <input
                      type="text"
                      id="certificateDescription"
                      name="certificateDescription"
                      placeholder={course?.certificateDescription}
                      defaultValue={course?.certificateDescription}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleCertificateDescription}
                    />
                    <div className="label">
                      <span className="label-text-alt">
                        Certification Description and Details
                      </span>
                    </div>
                  </label>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6"
                  >
                    Certificate Background
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
                    <div className="text-center">
                      {course?.certificateBackground && (
                        <CldImage
                          width={500}
                          height={500}
                          src={course?.certificateBackground}
                          alt="Description of my image"
                        />
                      )}
                      <div className="mt-4 flex text-sm leading-6">
                        <CldUploadWidget
                          uploadPreset="dtskghsx"
                          options={{
                            multiple: false,
                          }}
                          onSuccess={(results, options) => {
                            handleCertificateBackground(
                              results.info?.public_id
                            );
                          }}
                        >
                          {({ open }) => {
                            return (
                              <button
                                className="btn btn-outline btn-secondary"
                                onClick={() => open()}
                              >
                                Upload an Image
                              </button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievment Records Template */}
            <input
              type="radio"
              name="course_details"
              role="tab"
              className="tab"
              aria-label="Achievement Template"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="flex justify-end">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={handleCreateAchievementRecordsTemplate}
                >
                  <PlusIcon className="h-5 w-5" />
                  Create a Template
                </button>
              </div>
              <div className="border-2 border-primary/10 p-4 my-12">
                {achievementRecordsTemplates.length > 0 ? (
                  achievementRecordsTemplates.map((template) => (
                    <div key={template.id} className="mt-12">
                      <p className="text-xl font-bold">{template.name}</p>
                      <div className="my-10 grid grid-cols-1 gap-x-6 gap-y-8  sm:grid-cols-6 border border-dashed border-secondary/10 p-4">
                        <div className="sm:col-span-2">
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">Title</span>
                            </div>
                            <input
                              type="text"
                              id="templateName"
                              name="templateName"
                              placeholder={template.name}
                              defaultValue={template.name}
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleTemplateName}
                            />
                            <div className="label">
                              <span className="label-text-alt">
                                Change Template Name
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">Permalink</span>
                            </div>
                            <input
                              type="text"
                              id="templateName"
                              name="templateName"
                              placeholder={template.permalink}
                              defaultValue={template.permalink}
                              className="input input-bordered w-full max-w-xs"
                              onChange={handleTemplatePermalink}
                            />
                            <div className="label">
                              <span className="label-text-alt">
                                Change Template Permalink
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="col-span-full">
                          <label className="form-control">
                            <div className="label">
                              <span className="label-text">
                                Template Description
                              </span>
                            </div>
                            <textarea
                              className="textarea textarea-bordered h-24"
                              placeholder="This course is about ...."
                              defaultValue={template.description}
                              onChange={handleTemplateDescription}
                            ></textarea>
                            <div className="label">
                              <span className="label-text-alt">
                                Write some description about this template
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="col-span-full">
                          {/* <Editor
                            value={template.content}
                            onChange={handleTemplateContent}
                          /> */}
                        </div>
                        <button
                          className="btn btn-outline btn-error"
                          onClick={() =>
                            handleDeleteAchievementRecordsTemplate(template.id)
                          }
                        >
                          <TrashIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No achievement records templates found"
                    description="Click the button above to create a new template"
                    buttonText=""
                    buttonLink=""
                  />
                )}
              </div>
            </div>

            <input
              type="radio"
              name="course_details"
              role="tab"
              className="tab"
              aria-label="Enrollments"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="overflow-x-auto">
                {/* enrollment modal */}
                <dialog id="add_enrollment" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Add Enrollment</h3>
                    {addEnrollmentStatus === 201 ? (
                      <div role="alert" className="alert alert-success my-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{addEnrollmentMessage}</span>
                      </div>
                    ) : addEnrollmentStatus === 0 ? (
                      <p className="py-4">
                        Please fill the following form to add a new enrollment
                        to your course.
                      </p>
                    ) : (
                      <div role="alert" className="alert alert-error my-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{addEnrollmentMessage}</span>
                      </div>
                    )}
                    <div className="">
                      <form
                        method="dialog"
                        onSubmit={handleAddEnrollmentSubmit}
                      >
                        <DateTimeInput
                          title="Enrollment Expiration"
                          onChange={handleEnrollmentExpiration}
                          defaultValue={"2050-01-01T00:00"}
                        />
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
                          />
                        </label>
                        <select
                          className="select select-bordered w-full max-w-xs"
                          id="siteId"
                          name="siteId"
                        >
                          <option disabled value="Select the site">
                            Select the site
                          </option>
                          {course.sites.map((site) => (
                            <option key={site.id} value={site.id}>
                              {site.name}
                            </option>
                          ))}
                        </select>
                        <div className="modal-action">
                          <button className="btn btn-primary">Save</button>
                          <div
                            className="btn btn-outline"
                            onClick={() =>
                              document.getElementById("add_enrollment").close()
                            }
                          >
                            Cancel
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </dialog>
                {/* end of enrollment modal */}
                {enrollments.length === 0 ? (
                  <div className="mx-auto max-w-md sm:max-w-3xl">
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
                          Add Students
                        </h2>
                        <p className="mt-1 text-sm ">
                          This course doesn&apos;t have any students yet.
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline btn-ghost mt-4"
                          onClick={() =>
                            document
                              .getElementById("add_enrollment")
                              .showModal()
                          }
                        >
                          <PlusIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          Add Students
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="my-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="btn btn-outline btn-ghost"
                        onClick={() =>
                          document.getElementById("add_enrollment").showModal()
                        }
                      >
                        <PlusIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        Add Enrollment
                      </button>
                    </div>{" "}
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Enrollment Date</th>
                          <th>Status</th>
                          <th>Expires at</th>
                          <></>
                        </tr>
                      </thead>

                      <tbody className="">
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.userId}>
                            <td>{enrollment.user.name}</td>
                            <td>{enrollment.user.email}</td>
                            <td>{formatDateTime(enrollment.enrolledAt)}</td>
                            <td>
                              <select
                                className={`select select-bordered ${
                                  enrollment.status === "completed"
                                    ? "select-success"
                                    : enrollment.status === "pending"
                                    ? "select-warning"
                                    : ""
                                }`}
                                defaultValue={enrollment.status}
                                onChange={(e) =>
                                  handleEnrollmentStatus(
                                    enrollment,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                              </select>
                            </td>
                            <td>
                              <DateTimeInput
                                title=""
                                onChange={(expiresAt) =>
                                  handleUpdateEnrollmentExpiration(
                                    enrollment,
                                    expiresAt
                                  )
                                }
                                defaultValue={enrollment.expiresAt}
                              />
                            </td>
                            <td
                              className="btn btn-outline btn-error my-7"
                              onClick={() => handleDeleteEnrollment(enrollment)}
                            >
                              <TrashIcon
                                className="h-5 w-6"
                                aria-hidden="true"
                              />
                            </td>
                          </tr>
                        ))}
                        {/* row 1 */}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Waitlist Tab */}
            <input
              type="radio"
              name="course_details"
              role="tab"
              className="tab"
              aria-label="Waitlist"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div>
                {waitListedEnrollments.length === 0 ? (
                  <div className="mx-auto max-w-md sm:max-w-3xl">
                    <div>
                      <div className="text-center">
                        <h2 className="mt-2 text-base font-semibold leading-6">
                          No students in the waitlist
                        </h2>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-end justify-end gap-x-6 gap-y-12 mt-8">
                    <div
                      className="lg:tooltip"
                      data-tip="Enroll all the students in the waitlist to get a spot in the course"
                    >
                      <button
                        className="btn btn-outline btn-ghost"
                        onClick={() => handleBulkEnroll()}
                      >
                        <LockOpenIcon className="h-5 w-6" />
                        Bulk Enroll
                      </button>
                    </div>
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Waitlisted Date</th>
                          <></>
                          <></>
                        </tr>
                      </thead>

                      <tbody>
                        {waitListedEnrollments.map((enrollment) => (
                          <tr key={enrollment.userId}>
                            <td>{enrollment.user.name}</td>
                            <td>{enrollment.user.email}</td>
                            <td>{formatDateTime(enrollment.enrolledAt)}</td>
                            <div
                              className="lg:tooltip"
                              data-tip="Open an spot for the student"
                            >
                              <td
                                className="btn btn-outline btn-primary my-7 mx-2"
                                onClick={() =>
                                  handleUnlockEnrollment(enrollment)
                                }
                              >
                                <LockKeyholeOpenIcon className="h-5 w-6" />
                              </td>
                            </div>
                            <td
                              className="btn btn-outline btn-error my-7 mx-2"
                              onClick={() => handleDeleteEnrollment(enrollment)}
                            >
                              <TrashIcon
                                className="h-5 w-6"
                                aria-hidden="true"
                              />
                            </td>
                          </tr>
                        ))}
                        {/* row 1 */}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Course;
