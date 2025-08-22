import { useCallback, useEffect, useRef, useState } from 'react'
import { FramesData, DefaultFrameConsumerWeb, ConsumptionStatus } from '@redoctor/sdk'
import { RoundedContainer } from '@/components/RoundContainer.tsx'
import { Progress } from '@/components/ui/progress.tsx'
import { PpgWindow } from '@/components/PpgWindow.tsx'
import { cn } from '@/components/lib/utils.ts'

type Props = {
  className?: string
  onComplete: (frames: FramesData) => void
}

export const PpgSignalCollectionStep = (props: Props) => {
  const consumer = useRef<DefaultFrameConsumerWeb>(new DefaultFrameConsumerWeb())
  const [status, setStatus] = useState<ConsumptionStatus>(ConsumptionStatus.READY_TO_START)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setStatus(ConsumptionStatus.READY_TO_START)
    consumer.current.resetFramesData() // Reset the frames data when the component mounts
  }, [])

  const onConsumerComplete = useCallback(() => {
    const framesData = consumer.current.getVitalsFramesData()
    props.onComplete(framesData)
  }, [props.onComplete])

  /**
   * Handles the frame processing for the PPG signal collection.
   * @param imageData - The ImageData object containing the frame data.
   * @return A boolean indicating whether the ingested frame is the last one and camera session should end.
   */
  const handleFrame = useCallback(
    (imageData: ImageData) => {
      const processingResult = consumer.current.offer(imageData)
      setStatus(processingResult.value!)

      if (processingResult.value === ConsumptionStatus.IN_PROGRESS) {
        if (consumer.current.getCounter() % 200 === 0) {
          setProgress(consumer.current.getProgress())
        }
        setProgress(consumer.current.getProgress())
        return false
      } else if (processingResult.value === ConsumptionStatus.RED_INTENSITY_NOT_ENOUGH) {
        consumer.current.resetFramesData()
        return false
      } else if (processingResult.value === ConsumptionStatus.VALIDATION_ERROR) {
        consumer.current.resetFramesData()
        return false
      } else if (processingResult.value === ConsumptionStatus.MEASUREMENT_FAILED) {
        consumer.current.resetFramesData()
        return false
      } else if (processingResult.value === ConsumptionStatus.START_CALCULATING) {
        return true
      }

      return false
    },
    [props.onComplete, consumer]
  )

  return (
    <div className={cn('flex justify-center w-full', props.className ?? '')}>
      <RoundedContainer className="w-sm max-w-sm p-4 shadow-md">
        <PpgWindow handleFrame={handleFrame} onClose={onConsumerComplete} />

        <div className="dark:text-white my-4">{status}</div>

        <Progress value={progress} className="w-[100%]" />
      </RoundedContainer>
    </div>
  )
}
