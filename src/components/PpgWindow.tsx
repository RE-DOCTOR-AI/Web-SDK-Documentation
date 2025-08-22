import { memo, useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  handleFrame: (imageData: ImageData) => boolean // true if the last frame was processed
  onClose: () => void // callback to call after resources cleanup
  className?: string
}

const startRearCamera = async (videoElement: HTMLVideoElement): Promise<boolean> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error('MediaDevices.getUserMedia is not supported')
    return false
  }

  let stream: MediaStream | null = null

  // 1. find specific camera by label
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoInputs = devices.filter(d => d.kind === 'videoinput')
  const macroCam = videoInputs.find(d => d.label.toLowerCase().includes('macro'))
  const backCam = videoInputs.find(d => d.label.toLowerCase().includes('back'))
  const deviceId = macroCam?.deviceId || backCam?.deviceId

  // helper to apply torch if supported
  const enableTorch = async (track: MediaStreamTrack) => {
    const caps = track.getCapabilities() as any
    if (caps?.torch) {
      try {
        await (track as any).applyConstraints({ advanced: [{ torch: true }] })
      } catch {}
    }
  }

  // 2. try exact deviceId
  if (deviceId) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      })
    } catch {}
  }

  // 3. fallback to environment facingMode
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      })
    } catch {}
  }

  // 4. final generic fallback
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
    } catch (err) {
      console.error('Unable to access any camera', err)
      return false
    }
  }

  // attach stream and enable torch
  videoElement.srcObject = stream
  await videoElement.play()
  const track = stream.getVideoTracks()[0]
  await enableTorch(track)

  return true
}

const startFrontCamera = async (videoElement: HTMLVideoElement): Promise<void> => {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: 'user' },
    },
  }

  try {
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia(constraints)
    await videoElement.play()
  } catch (error: any) {
    console.log(`Error accessing the front camera: ${error.message}`)
  }
}

export const PpgWindow = memo(({ handleFrame, onClose, className = '' }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isStopping = useRef(false)
  const [interval, setIntervalState] = useState<any>(null)

  const setupCamera = useCallback((): void => {
    const videoElement = videoRef.current

    if (videoElement) {
      startRearCamera(videoElement).then(success => {
        if (!success) {
          console.debug('Failed to start rear camera, try frontal.')
          return startFrontCamera(videoElement)
        }
      })
    } else {
      console.error('Video element not found')
    }
  }, [videoRef.current])

  const stopCamera = useCallback(async () => {
    console.log('stopping camera')

    if (isStopping.current) return
    isStopping.current = true

    const videoElement = videoRef.current

    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream
      const videoTracks = stream.getVideoTracks()

      await Promise.all(
        videoTracks.map(async track => {
          const capabilities = track.getCapabilities()
          // @ts-ignore
          if (capabilities?.torch) {
            try {
              // @ts-ignore
              await track.applyConstraints({ advanced: [{ torch: false }] })
              console.log('Torch disabled')
            } catch (err) {
              console.log('Failed to disable torch', err)
            }
          } else {
            console.log('Torch not supported')
          }

          track.stop()
        })
      )

      videoElement.srcObject = null
      onClose()
    }

    interval && clearInterval(interval)
  }, [videoRef.current, isStopping.current, onClose, interval])

  const start = useCallback(() => {
    setIntervalState(
      setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || isStopping.current) {
          return
        }

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d') as CanvasRenderingContext2D

        try {
          context.drawImage(video, 0.0, 0.0, video.width, video.height)

          const imageData = context.getImageData(0.0, 0.0, canvas.width, canvas.height, {
            colorSpace: 'srgb',
          })
          const isLastFrame = handleFrame(imageData)

          if (isLastFrame) {
            await stopCamera()
          }
        } catch (e) {
          console.log('Failed to consume frame', e)
        }
      }, 15)
    )
  }, [videoRef.current])

  useEffect(() => {
    setupCamera()
    start()

    return () => {
      // Avoid calling stopCamera on unmount if it was already triggered.
      if (!isStopping.current && videoRef.current) {
        stopCamera().then(() => console.log('stopped'))
      }
    }
  }, [])

  return (
    <div className={`video-capture-container ${className}`}>
      <video ref={videoRef} id="videoElement" width="354" height="288" autoPlay playsInline></video>
      <canvas ref={canvasRef} id="canvas" style={{ overflow: 'auto' }} width="177" height="144" hidden></canvas>
    </div>
  )
})
