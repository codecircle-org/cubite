"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MultiInput from "@/app/components/MultiInput";
import MultiSelect from "@/app/components/MultiSelect";
import DateTimeInput from "@/app/components/DateTimeInput";
import Alert from "@/app/components/Alert";
import { CldUploadWidget } from "next-cloudinary";
import { z } from "zod";

interface Option {
  id: string;
  name: string;
}

const courseSchema = z.object({
  name: z.string().nonempty({ message: "Course name is requiered" }),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  introVideo: z.string().optional(),
  price: z.number().optional(),
  instructors: z
    .array(z.string())
    .nonempty({ message: "At least one instructor is required" }),
  subjects: z.array(z.object({ name: z.string() })).optional(),
  topics: z.array(z.object({ name: z.string() })).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  level: z.string().optional(),
});

const CourseNew = () => {
  const { status, data: session } = useSession();
  const [courseName, setCourseName] = useState("");
  const [courseCoverImage, setCourseCoverImage] = useState("");
  const [courseIntroVideo, setCourseIntroVideo] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [instructors, setInstructors] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<Option[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Option[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Option[]>([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndtDate] = useState<string>();
  const [level, setLevel] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleCourseName = (e) => {
    setCourseName(e.target.value);
  };

  const handleCoursePrice = (e) => {
    setCoursePrice(e.target.value);
  };

  const handleLevel = (e) => {
    setLevel(e.target.value);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const startDateTime = startDate ? new Date(startDate).toISOString() : null;
    const endDateTime = endDate ? new Date(endDate).toISOString() : null;

    const courseData = {
      name: courseName,
      coverImage: courseCoverImage,
      introVideo: courseIntroVideo,
      price: coursePrice ? parseFloat(coursePrice) : undefined,
      instructors: selectedInstructors.map((instructor) => instructor.id),
      subjects: selectedSubjects,
      topics: selectedTopics,
      startDate: startDateTime,
      endDate: endDateTime,
      level: level,
    };

    const CourseDataCreate = {
      name: courseName,
      instructors: selectedInstructors.map((instructor) => instructor.id),
    };

    // Conditionally add attributes if they exist and are not empty
    if (courseCoverImage) CourseDataCreate.coverImage = courseCoverImage;
    if (courseIntroVideo) CourseDataCreate.introVideo = courseIntroVideo;
    if (coursePrice) CourseDataCreate.price = parseFloat(coursePrice);
    if (selectedSubjects.length > 0)
      CourseDataCreate.subjects = selectedSubjects;
    if (selectedTopics.length > 0) CourseDataCreate.topics = selectedTopics;
    if (startDateTime) CourseDataCreate.startDate = startDateTime;
    if (endDateTime) CourseDataCreate.endDate = endDateTime;
    if (level) CourseDataCreate.level = level;
    const validation = courseSchema.safeParse(CourseDataCreate);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    const response = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(CourseDataCreate),
    });

    const result = await response.json();
    if (result.status === 201) {
      setSuccess("Course created successfully");
      router.push("/admin/courses");
    } else {
      setError(result.message);
    }
  };

  useEffect(() => {
    async function getInstructor() {
      const response = await fetch("/api/instructors", {
        cache: "no-store",
      });
      const result = await response.json();
      const instructors = result.instructors;
      setInstructors(instructors);
    }
    getInstructor();
  }, [session]);

  return (
    <div className="">
      <div className="flex-1 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create a New Course</h1>
            <p className="mt-2">
              Fill the following information to create a new course.
            </p>
          </div>
        </div>
      </div>
      <div className="border-b mb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
      </div>
      <div>
        <div className="space-y-12">
          {error && (
            <Alert
              status={400}
              message={error}
              onClose={() => setError(null)}
            />
          )}
          {success && (
            <Alert
              status={201}
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}
          <div className="border-b pb-12">
            <h2 className="font-semibold leading-7 text-lg">
              Course Information
            </h2>
            <p className="mt-1 text-sm leading-6">
              Please fill this information. This is basic info after creating
              the course you can provide more info.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Course Name</span>
                  </div>
                  <input
                    type="text"
                    name="courseName"
                    id="courseName"
                    placeholder="Marketing 101"
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleCourseName}
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt">
                      Name to show as course name to the users
                    </span>
                  </div>
                </label>
              </div>
              <MultiInput title={"Subjects"} onChange={setSelectedSubjects} />
              <MultiInput title={"Topics"} onChange={setSelectedTopics} />
              <DateTimeInput title="Start Date" onChange={setStartDate} />
              <DateTimeInput title="End Date" onChange={setEndtDate} />
              <div className="relative sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Price</span>
                  </div>
                  <input
                    type="number"
                    placeholder="$ 0.00"
                    defaultValue={0}
                    className="input input-bordered w-full max-w-xs"
                    onChange={handleCoursePrice}
                  />
                  <div className="label">
                    <span className="label-text-alt">Price in USD</span>
                  </div>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Cover Photo</span>
                  </div>
                  {courseCoverImage ? (
                    <CldUploadWidget
                      uploadPreset="dtskghsx"
                      options={{
                        multiple: false,
                      }}
                      onSuccess={(results, options) => {
                        setCourseCoverImage(results.info?.public_id);
                      }}
                    >
                      {({ open }) => {
                        return (
                          <button
                            className="btn btn-error btn-outline"
                            onClick={() => open()}
                          >
                            Change Cover Image
                          </button>
                        );
                      }}
                    </CldUploadWidget>
                  ) : (
                    <CldUploadWidget
                      uploadPreset="dtskghsx"
                      options={{
                        multiple: false,
                      }}
                      onSuccess={(results, options) => {
                        setCourseCoverImage(results.info?.public_id);
                      }}
                    >
                      {({ open }) => {
                        return (
                          <button
                            className="btn btn-ghost btn-outline"
                            onClick={() => open()}
                          >
                            Upload an Image
                          </button>
                        );
                      }}
                    </CldUploadWidget>
                  )}
                  <div className="label">
                    {courseCoverImage ? (
                      <span className="label-text-alt">
                        You uploaded an Image {courseCoverImage} or Click to
                        change it
                      </span>
                    ) : (
                      <span className="label-text-alt">
                        Upload the Cover Image
                      </span>
                    )}
                  </div>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Intro Video</span>
                  </div>
                  <CldUploadWidget
                    uploadPreset="dtskghsx"
                    options={{
                      multiple: false,
                    }}
                    onSuccess={(results, options) => {
                      setCourseIntroVideo(results.info?.public_id);
                    }}
                  >
                    {({ open }) => {
                      return (
                        <button
                          className="btn btn-ghost btn-outline"
                          onClick={() => open()}
                        >
                          Upload a Video
                        </button>
                      );
                    }}
                  </CldUploadWidget>
                  <div className="label">
                    <span className="label-text-alt">
                      Upload an intro video for the course
                    </span>
                  </div>
                </label>
              </div>

              <MultiSelect
                title="Instructors"
                options={instructors}
                onChange={setSelectedInstructors}
              />
              <div className="sm:col-span-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Course Level</span>
                  </div>
                  <select
                    className="select select-bordered"
                    onChange={handleLevel}
                  >
                    <option disabled selected>Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="label">
                    <span className="label-text-alt">
                      Pick course level, if there is no level leave it empty
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="btn btn-primary px-8"
            onClick={handleCreateCourse}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseNew;
