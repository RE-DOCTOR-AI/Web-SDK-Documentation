import ReactDOM from 'react-dom/client'
import { VitalsScannerSDK } from '@redoctor/sdk'
import { createBrowserRouter, RouterProvider } from 'react-router'
import UserParameters from '@/user-parameters.ts'
import { Dashboard } from '@/routes/Dashboard.tsx'
import { Main } from '@/routes/Main.tsx'

;(async function () {
  await VitalsScannerSDK.withValidation('loose').initScanner(import.meta.env.VITE_REDOCTOR_SDK_KEY, UserParameters)
})()

const router = createBrowserRouter([
  {
    path: '/',
    Component: Main,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
])

const root = document.getElementById('app')

ReactDOM.createRoot(root!).render(<RouterProvider router={router} />)
