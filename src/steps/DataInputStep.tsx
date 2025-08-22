import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import UserDataForm, { CalibrationValues, UserParameters } from '@/components/UserDataForm.tsx'
import { RoundedContainer } from '@/components/RoundContainer.tsx'
import { ContainerHeader } from '@/components/ContainerHeader.tsx'
import { ContainerBody } from '@/components/ContainerBody.tsx'

interface Props {
  onStart: (data: UserParameters, calibration?: CalibrationValues) => void
}

export const DataInputStep = ({ onStart }: Props) => {
  const [isStart, setIsStart] = useState(true)

  const leftContainerMdStyles = 'md:p-0 md:mb-0 md:bg-blue-500 md:flex'

  return (
    <div className="md:flex flex-row h-screen">
      <div
        className={`flex-1 flex items-center justify-center mb-8 px-6 ${isStart ? 'show' : 'hidden'} ${leftContainerMdStyles}`}
      >
        <RoundedContainer className="instructions-container w-sm max-w-sm flex-1 shadow-md md:text-white md:border-0 md:p-0">
          <ContainerHeader divider>Collect vital signs</ContainerHeader>

          <ContainerBody>
            <ul className="mb-8">
              <li>🩸 Blood Glucose</li>
              <li>💧 Blood Oxygen Saturation</li>
              <li>♥️ Heart Rate</li>
              <li>🫁 Respiration Rate</li>
              <li>💪 Blood Pressure</li>
            </ul>

            <Button className="text-2xl w-[100%] md:hidden" size="lg" onClick={() => setIsStart(false)}>
              Enter your data
            </Button>
          </ContainerBody>
        </RoundedContainer>
      </div>

      <div className={`flex-1 flex justify-center items-center ${isStart ? 'hidden' : 'show'} md:flex`}>
        <RoundedContainer className="w-sm max-w-sm shadow-md">
          <ContainerHeader divider>Enter your details</ContainerHeader>
          <ContainerBody>
            <UserDataForm onStart={onStart} />
          </ContainerBody>
        </RoundedContainer>
      </div>
    </div>
  )
}
