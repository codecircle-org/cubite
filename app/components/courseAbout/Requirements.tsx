import React from 'react'
import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";

interface RequirementsProps {
    requirements: any;
    site: any;
  }

  function Requirements({ requirements, site }: RequirementsProps) {
    return (
    <div className='m-24'>
        <RenderEditorComponents blocks={requirements.blocks} site={site} />
    </div>
  )
}

export default Requirements