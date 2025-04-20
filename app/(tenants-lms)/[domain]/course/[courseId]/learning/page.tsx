import React from 'react'


async function LearningPage({params: {domain, courseId}}: {params: {courseId: string, domain: string}}) {

    const courseAttributesApiUrl = `${process.env.ROOT_URL}/api/course/${courseId}`;
    const coursesResponse = await fetch(courseAttributesApiUrl);
    const coursesData = await coursesResponse.json();
    const course = coursesData.course;


  return (
    <div className='flex flex-col'>
        <div className='text-xl my-4 mx-2'>Welcome to {course?.name}</div>
    </div>
  )
}

export default LearningPage