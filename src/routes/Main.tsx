import { useCallback, useState } from 'react'
import { FramesData, VitalSignsProcessorCalibrationData } from '@redoctor/sdk'
import { cn } from '@/components/lib/utils.ts'
import { Header } from '../components/Header.tsx'
import { DataInputStep } from '@/steps/DataInputStep.tsx'
import { PpgSignalCollectionStep } from '@/steps/PpgSignalCollectionStep.tsx'
import { CalibrationValues, UserParameters } from '@/components/UserDataForm.tsx'
import { ResultProcessingStep } from '@/steps/ResultProcessingStep.tsx'
import '../app.scss'

const USE_STORED_FRAMES = false

// Shortcut for development
const getStoredFramesData = () => {
  const framesData = localStorage.getItem('framesData')
  if (framesData) {
    return JSON.parse(framesData)
  }
  return null
}

const Step = {
  DataInput: 0,
  SignalCollection: 1,
  ResultProcessing: 2,
}

export function Main() {
  const [step, setStep] = useState(0)
  const [framesData, setFramesData] = useState<FramesData | null>(getStoredFramesData())
  const [calibrationData, setCalibrationData] = useState<VitalSignsProcessorCalibrationData>()

  const resetFlow = useCallback(() => {
    setStep(Step.DataInput)
    setFramesData(null)
  }, [])

  const handleStartCapture = useCallback((_: UserParameters, calibration?: CalibrationValues) => {
    const _calibration =
      calibration?.systolicPressure && calibration?.diastolicPressure
        ? { bloodPressure: { systolic: calibration.systolicPressure, diastolic: calibration.diastolicPressure } }
        : undefined

    setCalibrationData(_calibration)
    setStep(USE_STORED_FRAMES && framesData ? Step.ResultProcessing : Step.SignalCollection)
  }, [])

  const handleCaptureComplete = useCallback((frames: FramesData) => {
    setFramesData(frames)
    localStorage.setItem('framesData', JSON.stringify(frames))
    setStep(Step.ResultProcessing)
  }, [])

  return (
    <div className={`h-100`}>
      <Header className={cn('md:absolute top-0 left-0 right-0')} />

      {step === 0 && <DataInputStep onStart={handleStartCapture} />}
      {step === 1 && <PpgSignalCollectionStep className={'md:mt-[10rem]'} onComplete={handleCaptureComplete} />}
      {step === 2 && (
        <ResultProcessingStep
          className={'md:mt-[10rem]'}
          framesData={framesData}
          calibrationData={calibrationData}
          onReset={resetFlow}
        />
      )}
    </div>
  )
}
