"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "../CourseCard";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import CoursesSearch from "@/app/components/courses/Search";

const CoursesFilter = ({ courses, site }) => {
  const [topics, setTopics] = useState([]);
  const [levels, setLevels] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const uniqueTopics = new Set();
    const uniqueLevels = new Set();
    const uniqueSubjects = new Set();

    courses.forEach((course) => {
      course.topics.forEach((topic) => uniqueTopics.add(topic.name));
      course.level != null && course.level != "" && uniqueLevels.add(course.level);
      course.subjects.forEach((subject) => uniqueSubjects.add(subject.name));
    });

    setTopics([...uniqueTopics]);
    setLevels([...uniqueLevels]);
    setSubjects([...uniqueSubjects]);
  }, [courses]);

  const handleFilterChange = (type, value) => {
    if (type === "topics") {
      setSelectedTopics((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "levels") {
      setSelectedLevels((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "subjects") {
      setSelectedSubjects((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm =
      course.name.toLowerCase().includes(searchTerm) ||
      (course.description &&
        course.description.toLowerCase().includes(searchTerm)) ||
      course.topics.some((topic) =>
        topic.name.toLowerCase().includes(searchTerm)
      ) ||
      course.subjects.some((subject) =>
        subject.name.toLowerCase().includes(searchTerm)
      );
    const matchesTopics =
      selectedTopics.length === 0 ||
      course.topics.some((topic) => selectedTopics.includes(topic.name));
    const matchesLevels =
      selectedLevels.length === 0 || selectedLevels.includes(course.level);
    const matchesSubjects =
      selectedSubjects.length === 0 ||
      course.subjects.some((subject) =>
        selectedSubjects.includes(subject.name)
      );
    return (
      matchesSearchTerm && matchesTopics && matchesLevels && matchesSubjects
    );
  });

  const renderFilterOptions = (options, type) => (
    <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-4 shadow">
      {options.map((option, index) => (
        <li key={index}>
          <label className="label cursor-pointer">
            <span className="label-text">{option}</span>
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={
                (type === "topics" && selectedTopics.includes(option)) ||
                (type === "levels" && selectedLevels.includes(option)) ||
                (type === "subjects" && selectedSubjects.includes(option))
              }
              onChange={() => handleFilterChange(type, option)}
            />
          </label>
        </li>
      ))}
    </ul>
  );

  const renderFilterButton = (name, count, options, type) => (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn m-1 flex items-center">
        {name}
        {count > 0 && (
          <span className="ml-2 badge badge-sm badge-primary">{count}</span>
        )}
        <ChevronDownIcon className="w-4 h-4 ml-1" />
      </div>
      {renderFilterOptions(options, type)}
    </div>
  );

  return (
    <div className="mx-12 mb-36">
      <CoursesSearch onSearchChange={handleSearchChange} />
      <div className="my-12 flex gap-4">
        {topics.length > 0 && renderFilterButton("Topics", selectedTopics.length, topics, "topics")}
        {levels.length > 0 && renderFilterButton("Levels", selectedLevels.length, levels, "levels")}
        {subjects.length > 0 && renderFilterButton("Subjects", selectedSubjects.length, subjects, "subjects")}
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} site={site} />
        ))}
      </div>
    </div>
  );
};

export default CoursesFilter;
