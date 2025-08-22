# ReDoctor SDK Integration Guide

Here's how to integrate and consume the @redoctor/sdk in your client application:

## 1. VitalsScannerSDK Initialization

Initialize the SDK with your license key and user parameters provider:

```typescript
import { VitalsScannerSDK } from '@redoctor/sdk'
import UserParameters from './user-parameters'

// Initialize the SDK
await VitalsScannerSDK
  .withValidation('loose')  // Set validation mode
  .initScanner(
    'your-license-key-here',
    UserParameters  // User parameters provider
  )
```

## 2. User Parameters Provider Implementation

Create a provider that returns user data required for processing:

```typescript
import { UserParametersProvider, User } from '@redoctor/sdk'

const userParameters: UserParametersProvider = {
  getUserParameters(): User | null {
    // Retrieve user data from storage or another source
    const savedData = localStorage.getItem('userData')
    return savedData ? JSON.parse(savedData) : null
  },
}

export default userParameters
```

## 3. Signal Collection from Camera

Use `DefaultFrameConsumerWeb` to collect frames from the camera, see `PpgWindow.tsx` component for reference:

```typescript
import { DefaultFrameConsumerWeb, ConsumptionStatus, FramesData } from '@redoctor/sdk'

// Initialize the frame consumer
const consumer = new DefaultFrameConsumerWeb()

// Reset frames data if needed
consumer.resetFramesData()

// Process frames from camera
function handleFrame(imageData: ImageData): boolean {
  const processingResult = consumer.offer(imageData)
  const status = processingResult.value!
  
  if (status === ConsumptionStatus.IN_PROGRESS) {
    // Update progress if needed
    const progress = consumer.getProgress()
    return false
  } else if (status === ConsumptionStatus.START_CALCULATING) {
    // Collection complete, ready for processing
    return true
  } else if ([
    ConsumptionStatus.RED_INTENSITY_NOT_ENOUGH,
    ConsumptionStatus.VALIDATION_ERROR,
    ConsumptionStatus.MEASUREMENT_FAILED
  ].includes(status)) {
    // Handle error states
    consumer.resetFramesData()
    return false
  }
  
  return false
}

// When collection is complete, get the frames data
const framesData = consumer.getVitalsFramesData()
```

## 4. Data Processing

Process collected frames using the processor factory:

```typescript
import {ProcessorFactory, VitalsResult, VitalSignsProcessorCalibrationData} from '@redoctor/sdk'

async function processData(
  framesData: FramesData,
  calibrationData?: VitalSignsProcessorCalibrationData
) {
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
      // Save the processed result, set to be displayed in the UI, etc.
    })
}
```

The result object contains various vitals measurements including blood glucose, SpO2, heart rate, blood pressure, and
more.