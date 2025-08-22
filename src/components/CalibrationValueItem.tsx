import { memo } from 'react'
import { LuX } from 'react-icons/lu'
import { CalibrationBloodPressure } from '@redoctor/sdk'

export default memo(function CalibrationValueItem(props: { bp: CalibrationBloodPressure; onDelete: () => void }) {
  const { bp } = props

  return (
    <div className="flex flex-row justify-between align-middle gap-1 rounded-md bg-gray-200 dark:bg-gray-600 p-2">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {bp.systolic} mmHg / {bp.diastolic} mmHg
      </div>

      <LuX className="self-center" onClick={props.onDelete} />
    </div>
  )
})
