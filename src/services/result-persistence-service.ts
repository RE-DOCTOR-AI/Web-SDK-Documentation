import { VitalsResult } from '@redoctor/sdk'
import { StoredResult } from '@/types/stored-result.ts'

class ResultPersistenceService {
  private readonly resultArrayKey: string = 'redoctor/vitals-results'
  private inMemoryResults: StoredResult[] = []

  constructor() {
    this.loadFromStorage()
  }

  get results(): StoredResult[] {
    return this.inMemoryResults
  }

  saveResults(result: VitalsResult) {
    this.inMemoryResults.push({
      timestamp: Date.now(),
      result,
    })
    this.persistResults()
  }

  private persistResults() {
    try {
      localStorage.setItem(this.resultArrayKey, JSON.stringify(this.inMemoryResults))
    } catch (error) {
      console.error('Failed to persist results to localStorage:', error)
    }
  }

  private loadFromStorage() {
    try {
      const storedResults = localStorage.getItem(this.resultArrayKey)
      if (storedResults) {
        const results = JSON.parse(storedResults)

        if (Array.isArray(results)) {
          this.inMemoryResults = results.map((item: any) => ({
            timestamp: item.timestamp,
            result: new VitalsResult(item.result.basicVitals, item.result.glucose, item.result.riskLevel),
          }))
        } else {
          console.warn('Stored results are not in the expected format.')
          this.inMemoryResults = []
        }
      }
    } catch (error) {
      console.error('Failed to load results from localStorage:', error)
      this.inMemoryResults = []
    }
  }

  clearResults() {
    this.inMemoryResults = []
    this.persistResults()
  }
}

export default new ResultPersistenceService()
