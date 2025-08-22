import { UserParametersProvider, User } from '@redoctor/sdk'

const userParameters: UserParametersProvider = {
  getUserParameters(): User | null {
    const savedData = localStorage.getItem('userData')
    return savedData ? JSON.parse(savedData) : null
  },
}

export default userParameters
