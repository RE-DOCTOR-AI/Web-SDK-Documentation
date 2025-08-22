import { useState } from 'react'
import { cn } from '@/components/lib/utils.ts'
import { Header } from '@/components/Header.tsx'
import { StoredResult } from '@/types/stored-result.ts'
import resultPersistenceService from '@/services/result-persistence-service.ts'
import { GlucoseChart } from '@/components/charts/GlucoseChart.tsx'

export function Dashboard() {
  const [results] = useState<StoredResult[]>(resultPersistenceService.results)

  if (results.length === 0) {
    return <div className="text-gray-500">Please measure vitals to show collected data.</div>
  }

  return (
    <>
      <Header className={cn('md:absolute top-0 left-0 right-0')} />

      <div className={cn('mt-4 md:mt-25')}>
        <div className={cn('mx-8')}>
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          <GlucoseChart results={results} />
        </div>
      </div>
    </>
  )
}
