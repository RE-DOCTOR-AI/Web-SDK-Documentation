import * as yup from 'yup'
import { useState } from 'react'
import { LuX } from 'react-icons/lu'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import LocaleNumberInput from '@/components/LocaleNumberInput.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import CalibrationValuesList from '@/components/CalibrationValuesList.tsx'

export interface FormData {
  height: number
  weight: number
  age: number
  gender: number
  restHeartRate?: number | undefined
  calibrationValues?: {
    systolicPressure: number | null
    diastolicPressure: number | null
  }
}

export interface UserParameters {
  height: number
  weight: number
  age: number
  gender: number
  restHeartRate?: number | undefined
}

export interface CalibrationValues {
  systolicPressure: number
  diastolicPressure: number
}

const schema = yup.object({
  height: yup
    .number()
    .typeError('Height must be a number')
    .required('Height is required')
    .min(0, 'Height must be greater than or equal to 0')
    .max(3, 'Height must be less than or equal to 3'),
  weight: yup
    .number()
    .typeError('Weight must be a number')
    .required('Weight is required')
    .min(0, 'Weight must be greater than or equal to 0')
    .max(300, 'Weight must be less than or equal to 300'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .min(0, 'Age must be greater than or equal to 0')
    .max(99, 'Age must be less than or equal to 99'),
  restHeartRate: yup
    .number()
    .optional()
    .typeError('Resting heart rate must be a number')
    .min(30, 'Resting heart rate must be greater than or equal to 30')
    .max(200, 'Resting heart rate must be less than or equal to 200'),
  gender: yup.number().oneOf([0, 1], 'Invalid gender').required('Gender is required'),
  calibrationValues: yup
    .object({
      systolicPressure: yup
        .number()
        .nullable()
        .transform(value => (value === null ? undefined : value))
        .typeError('Systolic pressure must be a number')
        .min(80, 'Systolic pressure must be greater than or equal to 80')
        .max(200, 'Systolic pressure must be less than or equal to 200')
        .required('Systolic pressure is required'),
      diastolicPressure: yup
        .number()
        .nullable()
        .transform(value => (value === null ? undefined : value))
        .typeError('Diastolic pressure must be a number')
        .min(40, 'Diastolic pressure must be greater than or equal to 40')
        .max(120, 'Diastolic pressure must be less than or equal to 120')
        .required('Diastolic pressure is required'),
    })
    .nullable()
    .default(undefined)
    .optional(),
})

const defaultValues: FormData = (() => {
  const savedData = localStorage.getItem('userData')
  if (savedData) {
    const parsedData = JSON.parse(savedData)
    return {
      height: parsedData.height ?? 0,
      weight: parsedData.weight ?? 0,
      age: parsedData.age ?? 0,
      restHeartRate: parsedData.restHeartRate,
      gender: parsedData.gender ?? 1,
      calibrationValues: undefined,
    }
  }

  return {
    height: 0,
    weight: 0,
    age: 0,
    restHeartRate: 0,
    gender: 1,
    calibrationValues: undefined,
  }
})()

interface Props {
  onStart: (data: UserParameters, calibration?: CalibrationValues) => void
}

const UserDataForm = ({ onStart }: Props) => {
  const [showCalibration, setShowCalibration] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues,
    // @ts-ignore
    resolver: yupResolver(schema),
  })

  const storeData = (data: FormData) => {
    localStorage.setItem('userData', JSON.stringify(data))
  }

  const cancelCalibration = () => {
    setShowCalibration(false)

    setValue('calibrationValues', undefined)
  }

  const onSubmit = (data: FormData) => {
    const userParameters = {
      height: data.height,
      weight: data.weight,
      age: data.age,
      gender: data.gender,
      restHeartRate: data.restHeartRate,
    }
    storeData(userParameters)

    if (data.calibrationValues?.systolicPressure && data.calibrationValues?.diastolicPressure) {
      onStart(userParameters, {
        systolicPressure: data.calibrationValues.systolicPressure,
        diastolicPressure: data.calibrationValues.diastolicPressure,
      })
    } else {
      onStart(userParameters)
    }
  }

  return (
    // @ts-ignore
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mb-4">
        <Label htmlFor="height">Height (m):</Label>
        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <LocaleNumberInput
              id="height"
              placeholder="Height in meters"
              value={field.value}
              onChange={field.onChange}
              step="0.01"
            />
          )}
        />
        {errors.height && <div className="text-red-500 text-sm">{errors.height.message}</div>}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Label htmlFor="weight">Weight (kg):</Label>
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <LocaleNumberInput
              id="weight"
              numberType="int"
              placeholder="Weight in kilos"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.weight && <div className="text-red-500 text-sm">{errors.weight.message}</div>}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Label htmlFor="age">Age:</Label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <LocaleNumberInput
              id="age"
              placeholder="Age"
              value={field.value}
              numberType="int"
              onChange={field.onChange}
              step="1"
            />
          )}
        />
        {errors.age && <div className="text-red-500 text-sm">{errors.age.message}</div>}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Label htmlFor="restHeartRate">Resting heart rate (optional):</Label>
        <Controller
          name="restHeartRate"
          control={control}
          render={({ field }) => (
            <LocaleNumberInput
              id="restHeartRate"
              placeholder="Resting heart rate"
              value={field.value as number | null}
              numberType="int"
              onChange={field.onChange}
              step="1"
            />
          )}
        />
        {errors.restHeartRate && <div className="text-red-500 text-sm">{errors.restHeartRate.message}</div>}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <Label htmlFor="gender">Gender at Birth:</Label>
        <div className="flex items-center gap-4">
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value === 1} onCheckedChange={checked => field.onChange(checked ? 1 : 0)} />
            )}
          />
          <span>{getValues('gender') === 1 ? 'Male' : 'Female'}</span>
        </div>
        {errors.gender && <div className="text-red-500 text-sm">{errors.gender.message}</div>}
      </div>

      {!showCalibration && (
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="text-md w-[100%] mb-8 cursor-pointer"
          onClick={() => setShowCalibration(true)}
        >
          Add calibration values (optional)
        </Button>
      )}

      {showCalibration && (
        <div className="border p-4 rounded-md mb-8 bg-slate-50 dark:bg-slate-900">
          <h3 className="text-lg font-medium mb-4 flex justify-between">
            Calibration values
            <LuX className="cursor-pointer" onClick={cancelCalibration} />
          </h3>

          <CalibrationValuesList className="mb-6" />

          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="systolicPressure">Systolic Pressure (mmHg):</Label>
            <Controller
              name="calibrationValues.systolicPressure"
              control={control}
              defaultValue={defaultValues.calibrationValues?.systolicPressure}
              render={({ field }) => (
                <LocaleNumberInput
                  id="systolicPressure"
                  placeholder="Systolic Pressure"
                  value={field.value as number}
                  numberType="int"
                  onChange={field.onChange}
                  step="1"
                  className="bg-white"
                />
              )}
            />
            {errors.calibrationValues?.systolicPressure && (
              <div className="text-red-500 text-sm">{errors.calibrationValues.systolicPressure.message}</div>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="diastolicPressure">Diastolic Pressure (mmHg):</Label>
            <Controller
              name="calibrationValues.diastolicPressure"
              control={control}
              defaultValue={defaultValues.calibrationValues?.diastolicPressure}
              render={({ field }) => (
                <LocaleNumberInput
                  id="diastolicPressure"
                  placeholder="Diastolic Pressure"
                  value={field.value as number}
                  numberType="int"
                  onChange={field.onChange}
                  step="1"
                  className="bg-white"
                />
              )}
            />
            {errors.calibrationValues?.diastolicPressure && (
              <div className="text-red-500 text-sm">{errors.calibrationValues.diastolicPressure.message}</div>
            )}
          </div>
        </div>
      )}

      <Button type="submit" size="lg" className="text-2xl w-[100%] cursor-pointer">
        Start
      </Button>
    </form>
  )
}

export default UserDataForm
