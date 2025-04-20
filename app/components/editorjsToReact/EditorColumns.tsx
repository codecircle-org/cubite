import React from 'react'
import RenderEditorComponents from './RenderEditorComponents'
function EditorColumns({ data }: { data: any }) {
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-${data.cols.length}`}>
        {
            data.cols.map((column: any, index: number) => (
                <div key={index} className="h-full">
                    <RenderEditorComponents key={index} blocks={column.blocks} site={""} />
                </div>
            ))
        }
    </div>
  )
}

export default EditorColumns