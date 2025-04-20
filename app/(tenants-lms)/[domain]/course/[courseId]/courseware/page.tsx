"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/app/components/courseware/Navigation";
import SideBar from "@/app/components/courseware/SideBar";
import Unit from "@/app/components/courseware/Unit";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Props {
  params: {
    courseId: string;
    domain: string;
  };
}

const Courseware = ({ params: { courseId, domain } }: Props) => {
  const [blocks, setBlocks] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [totalUnits, setTotalUnits] = useState(0);
  const [currentUnit, setCurrentUnit] = useState(1);
  const [progress, setProgress] = useState({});
  const [progressPercentage, setProgressPercentage] = useState(0);
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const fetchCourseContent = async () => {
        const response = await fetch(`/api/course/${courseId}`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (result.status === 200) {
          const latestContent =
            result.course.contents[0]?.content?.blocks || [];
          setBlocks(latestContent);
          setCourseName(result.course.name);

          const units = calculateTotalUnits(latestContent);
          setTotalUnits(units);

          // Fetch siteId and user progress
          const siteId = await fetchSiteId(domain);
          await fetchUserProgress(
            session?.user?.id,
            courseId,
            siteId,
            latestContent
          );
        }
      }
      fetchCourseContent();
    }
  }, [status, session, courseId, domain]);

  const fetchSiteId = async (domain) => {
    const response = await fetch(`/api/getSiteId?domain=${domain}`, {
      cache: "no-store",
    });
    const result = await response.json();
    return result.siteId;
  };

  const fetchUserProgress = async (userId, courseId, siteId, latestContent) => {
    const response = await fetch(
      `/api/progress?userId=${userId}&courseId=${courseId}&siteId=${siteId}`,
      { cache: "no-store" }
    );
    const result = await response.json();

    if (result.status === 200 && result.progress) {
      setProgress(result.progress.progress || {});
      const lastUnitId = result.progress.lastUnitId;
      const unitIndex = getUnitIndexByUnitId(latestContent, lastUnitId);
      setCurrentUnit(unitIndex);
      const initialUnit = getUnitContentByUnitId(latestContent, lastUnitId);
      setSelectedUnit(initialUnit);
      calculateProgressPercentage(result.progress.progress, latestContent);
    } else {
      const initialUnit = getUnitContent(latestContent, 1);
      setSelectedUnit(initialUnit);
      calculateProgressPercentage({}, latestContent);
    }
  };

  const calculateTotalUnits = (blocks) => {
    return blocks.filter(
      (block) => block.type === "header" && block.data.level === 3
    ).length;
  };

  const getUnitIndexByUnitId = (blocks, unitId) => {
    const units = blocks.filter(
      (block) => block.type === "header" && block.data.level === 3
    );
    for (let i = 0; i < units.length; i++) {
      if (units[i].id === unitId) {
        return i + 1;
      }
    }
    return 1;
  };

  const getUnitContentByUnitId = (blocks, unitId) => {
    const units = blocks.filter(
      (block) => block.type === "header" && block.data.level === 3
    );
    for (let i = 0; i < units.length; i++) {
      if (units[i].id === unitId) {
        const unitIndexInBlocks = blocks.indexOf(units[i]);
        const nextUnitIndexInBlocks = units[i + 1]
          ? blocks.indexOf(units[i + 1])
          : blocks.length;
        // Ensure we exclude any higher-level headers (sections) in the next unit's content
        const unitContent = blocks
          .slice(unitIndexInBlocks, nextUnitIndexInBlocks)
          .filter(
            (block) => !(block.type === "header" && block.data.level === 2)
          );
        return unitContent;
      }
    }
    return [];
  };

  const calculateProgressPercentage = (userProgress, blocks) => {
    const totalSubsections = calculateTotalUnits(blocks);
    const completedSubsections = Object.keys(userProgress).length;
    const percentage = (completedSubsections / totalSubsections) * 100;
    setProgressPercentage(percentage);
  };

  const handleSelectUnit = async (unitBlocks, unitIndex) => {
    setSelectedUnit(unitBlocks);
    setCurrentUnit(unitIndex);
    updateProgress(unitIndex, unitBlocks[0]?.id);
  };

  const updateProgress = async (unitIndex, unitId) => {
    const lastUnitId = unitId || getUnitContent(blocks, unitIndex)[0]?.id;
    const newProgress = { ...progress, [lastUnitId]: 1 }; // Assuming 1 means completed
    setProgress(newProgress);

    const siteId = await fetchSiteId(domain);
    const response = await fetch(
      `/api/progress?userId=${session?.user?.id}&courseId=${courseId}&siteId=${siteId}`,
      { cache: "no-store" }
    );
    const result = await response.json();

    const method = result.status === 200 && result.progress ? "PUT" : "POST";

    await fetch(`/api/progress`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user?.id,
        courseId,
        siteId,
        lastUnitId,
        progress: newProgress,
        progressPercentage: progressPercentage,
      }),
    });

    calculateProgressPercentage(newProgress, blocks);
  };

  const getUnitContent = (blocks, unitIndex) => {
    const units = blocks.filter(
      (block) => block.type === "header" && block.data.level === 3
    );
    const unit = units[unitIndex - 1];
    if (!unit) return [];

    const unitIndexInBlocks = blocks.indexOf(unit);
    const nextUnitIndexInBlocks = units[unitIndex]?.id
      ? blocks.indexOf(units[unitIndex])
      : blocks.length;

    const unitContent = blocks
      .slice(unitIndexInBlocks, nextUnitIndexInBlocks)
      .filter((block) => !(block.type === "header" && block.data.level === 2));

    return unitContent;
  };

  return (
    <div className="m-12">
      <Navigation
        courseName={courseName}
        progressPercentage={progressPercentage}
      />
      <div className="grid grid-cols-6 space-x-12">
        <div className="col-span-1">
          <SideBar
            blocks={blocks}
            onSelectUnit={handleSelectUnit}
            progress={progress}
          />
        </div>
        <div className="col-span-5 border border-dashed p-8">
          <Unit blocks={selectedUnit} />
        </div>
      </div>
    </div>
  );
};

export default Courseware;
