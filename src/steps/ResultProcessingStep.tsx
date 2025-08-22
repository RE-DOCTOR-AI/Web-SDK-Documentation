import { useEffect, useState } from 'react'
import {
  VitalsScannerSDK,
  VitalsResult,
  ProcessorFactory,
  FramesData,
  VitalSignsProcessorCalibrationData,
} from '@redoctor/sdk'
import { RoundedContainer } from '@/components/RoundContainer.tsx'
import { ContainerHeader } from '@/components/ContainerHeader.tsx'
import { ContainerBody } from '@/components/ContainerBody.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { Button } from '@/components/ui/button.tsx'
import ResultPersistenceService from '@/services/result-persistence-service.ts'

type Props = {
  className?: string
  onReset: () => void
  framesData: FramesData | null
  calibrationData?: VitalSignsProcessorCalibrationData
}

const ResultsLoading = () => {
  return (
    <div className="flex flex-col gap-2 mb-12">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-3/7" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-4/7" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  )
}

type VitalSignRowProps = {
  name: string
  value: number | (number | undefined)[] | undefined
  unit: string
  precision?: number
}

const locale = navigator.language || 'en-US' // Use the browser's locale or default to 'en-US'

const formatValue = (value: number | undefined, precision: number): string => {
  if (value === undefined || isNaN(value)) {
    return 'N/A'
  }
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formatter.format(value)
}

const VitalSignRow = ({ name, value, unit, precision = 2 }: VitalSignRowProps) => {
  let displayValue: string
  let isValueDefined = true

  if (Array.isArray(value)) {
    if (value.length > 0) {
      displayValue = value.map(item => formatValue(item, precision)).join(' / ')
    } else {
      displayValue = 'N/A'
      isValueDefined = false
    }
  } else if (value === undefined || isNaN(value)) {
    displayValue = 'N/A'
    isValueDefined = false
  } else {
    displayValue = formatValue(value, precision)
  }

  return (
    <div className="text-normal text-gray-500">
      <span className="text-gray-800 dark:text-gray-200">{name}:</span>{' '}
      <span className="text-gray-900 dark:text-gray-100">{displayValue}</span> {isValueDefined && <span>{unit}</span>}
    </div>
  )
}

export const ResultProcessingStep = ({ framesData, calibrationData, onReset, className = '' }: Props) => {
  const [processing, setProcessing] = useState(true)
  const [vitals, setVitals] = useState<VitalsResult | null>(null)

  useEffect(() => {
    if (!framesData) return

    ProcessorFactory.createCommonProcessor()
      .then(processor => {
        return processor
          .withVitalsFrameData(framesData)
          .withGlucoseFrameData(framesData)
          .withCalibrationData(calibrationData)
          .withUser(VitalsScannerSDK.user)
          .process()
      })
      .then((result: VitalsResult) => {
        setVitals(result)
        setProcessing(false)

        // save results if glucose and heart rate are available - mostly successful measurement
        if (result?.glucose?.getMean() > 0 && result.basicVitals?.heartRate > 0) {
          ResultPersistenceService.saveResults(result)
        }
      })
  }, [])

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <RoundedContainer className="w-sm max-w-sm shadow-md">
        <ContainerHeader divider>Results</ContainerHeader>
        <ContainerBody>
          {processing && <ResultsLoading />}
          {!processing && (
            <div className="flex flex-col gap-2 mb-12">
              <VitalSignRow name="Blood Glucose" value={vitals?.glucose.getMean()} unit="mg/dL" precision={0} />
              <VitalSignRow name="SpO2" value={vitals?.basicVitals.bloodOxygen} unit="%" precision={0} />
              <VitalSignRow
                name="Heart Rate"
                value={vitals?.basicVitals.heartRate}
                unit="beats per minute"
                precision={0}
              />
              <VitalSignRow
                name="Respiration Rate"
                value={vitals?.basicVitals.respirationRate}
                unit="per minute"
                precision={0}
              />
              <VitalSignRow
                name="Core Body Temperature"
                value={vitals?.basicVitals.coreBodyTemperature}
                unit="°C"
                precision={1}
              />
              <VitalSignRow
                name="Blood Pressure"
                value={[vitals?.basicVitals.systolicBloodPressure, vitals?.basicVitals.diastolicBloodPressure]}
                unit="mmHg"
                precision={0}
              />
              <VitalSignRow name="Pulse Pressure" value={vitals?.basicVitals.pulsePressure} unit="mmHg" precision={0} />
              <VitalSignRow name="HRV" value={vitals?.basicVitals.hrv} unit="ms" precision={0} />
              <VitalSignRow name="Stress Level" value={vitals?.basicVitals.stress} unit="%" precision={0} />
              <VitalSignRow name="LASI" value={vitals?.basicVitals.lasi} unit="m/s" precision={0} />
              <VitalSignRow name="Reflection Index" value={vitals?.basicVitals.reflectionIndex} unit="" precision={0} />
            </div>
          )}

          <Button className="text-2xl w-[100%]" onClick={onReset} disabled={processing}>
            Start again
          </Button>
        </ContainerBody>
      </RoundedContainer>
    </div>
  )
}
