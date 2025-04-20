import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";


class Courses {
  static get toolbox() {
    return {
      title: "Courses",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
      title: "Our Courses",
      description: "Here are our courses",
      courses: [],
      sortBy: "name_asc",
      limitCourses: 3,
    };
    this.siteId = config.siteId;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const CoursesComponent = ({ initialData }) => {
      const [title, setTitle] = useState(initialData.title || "");
      const [description, setDescription] = useState(
        initialData.description || ""
      );
      const [courses, setCourses] = useState(initialData.courses || []);
      const [sortBy, setSortBy] = useState(initialData.sortBy || "name_asc");
      const [limitCourses, setLimitCourses] = useState(
        initialData.limitCourses || 3
      );
      const [limitCoursesPerLine, setLimitCoursesPerLine] = useState(
        initialData.limitCoursesPerLine || 3
      );

      useEffect(() => {
        const getCourses = async () => {
          const response = await fetch(`/api/getSiteCourses?siteId=${this.siteId}`, {
            cache: "no-store",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          const result = await response.json();
          const fetchedCourses = result.courses.map((course) => {
            const existingCourse = initialData.courses?.find(
              (c) => c.id === course.id
            );
            return {
              ...course,
              featured: existingCourse ? existingCourse.featured : false,
              hide: existingCourse ? existingCourse.hide : false,
            };
          });
          setCourses(fetchedCourses);
        };
        getCourses();
      }, [initialData.courses]);

      const handleLimitCourses = (e) => {
        const value = e.target.value;
        setLimitCourses(value);
        this.data.limitCourses = value;
      };

      const handleLimitCoursesPerLine = (e) => {
        const value = e.target.value;
        setLimitCoursesPerLine(value);
        this.data.limitCoursesPerLine = value;
      };

      const handleSortBy = (e) => {
        const value = e.target.value;
        setSortBy(value);
        this.data.sortBy = value;
      };

      const handleFeatured = (courseId, checked) => {
        const updatedCourses = courses.map((course) =>
          course.id === courseId ? { ...course, featured: checked } : course
        );
        setCourses(updatedCourses);
        this.data.courses = updatedCourses;
      };

      const handleHide = (courseId, checked) => {
        const updatedCourses = courses.map((course) =>
          course.id === courseId ? { ...course, hide: checked } : course
        );
        setCourses(updatedCourses);
        this.data.courses = updatedCourses;
      };

      const handleTitle = (e) => {
        setTitle(e.target.value);
        this.data.title = e.target.value;
      };

      const handleDescription = (e) => {
        setDescription(e.target.value);
        this.data.description = e.target.value;
      };

      return (
        <div className="my-3">
          <div role="tablist" className="tabs tabs-lifted">
            <input
              type="radio"
              name="courses_tabs"
              role="tab"
              className="tab"
              aria-label="Courses Table"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="text-left">
                      <th>Name</th>
                      <th>Featured</th>
                      <th>Hide</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="hover">
                        <td>{course.name}</td>
                        <td>
                          <label>
                            <input
                              type="checkbox"
                              className="checkbox"
                              name="featured"
                              checked={!!course.featured}
                              onChange={(e) =>
                                handleFeatured(course.id, e.target.checked)
                              }
                            />
                          </label>
                        </td>
                        <td>
                          <label>
                            <input
                              type="checkbox"
                              className="checkbox"
                              name="hide"
                              checked={!!course.hide}
                              onChange={(e) =>
                                handleHide(course.id, e.target.checked)
                              }
                            />
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <input
              type="radio"
              name="courses_tabs"
              role="tab"
              className="tab"
              aria-label="Section Configs"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Section Title</span>
                    </div>
                    <input
                      className="input input-bordered"
                      onChange={handleTitle}
                      value={title}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Section Description</span>
                    </div>
                    <input
                      className="input input-bordered"
                      onChange={handleDescription}
                      value={description}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Sort By</span>
                    </div>
                    <select
                      className="select select-bordered"
                      onChange={handleSortBy}
                      value={sortBy}
                    >
                      <option disabled>Pick one</option>
                      <option value="name_asc">Name (A - Z)</option>
                      <option value="name_desc">Name (Z - A)</option>
                      <option value="level">Level</option>
                      <option value="start_date">Start Date</option>
                    </select>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
                        Number of Courses to Show
                      </span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={limitCourses}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleLimitCourses}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">
                        Number of Courses in each line
                      </span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={limitCoursesPerLine}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleLimitCoursesPerLine}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    root.render(<CoursesComponent initialData={this.data} />);

    return wrapper;
  }

  save(blockContent) {
    return {
      siteId: this.data.siteId,
      title: this.data.title,
      description: this.data.description,
      courses: this.data.courses,
      sortBy: this.data.sortBy,
      limitCourses: this.data.limitCourses,
      limitCoursesPerLine: this.data.limitCoursesPerLine,
    };
  }
}

export default Courses;
