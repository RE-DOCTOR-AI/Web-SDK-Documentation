import { VitalsScannerSDK } from '@redoctor/sdk'
import { cn } from '@/components/lib/utils.ts'
import CalibrationValueItem from '@/components/CalibrationValueItem.tsx'
import { useCallback, useState } from 'react'

type Props = {
  className?: string
}

export default function CalibrationValuesList({ className }: Props) {
  const [parameters, setParameters] = useState(VitalsScannerSDK.getCalibrationParameters())

  const onDeleteCalibration = useCallback((index: number) => {
    VitalsScannerSDK.removeCalibrationParameter(index)
    setParameters(VitalsScannerSDK.getCalibrationParameters())
  }, [])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {parameters.map(
        (parameter, index) =>
          parameter.bloodPressure && (
            <CalibrationValueItem
              key={index}
              bp={parameter.bloodPressure}
              onDelete={() => onDeleteCalibration(index)}
            />
          )
      )}
    </div>
  )
}
