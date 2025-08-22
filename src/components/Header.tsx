import { LuSun, LuMoon } from 'react-icons/lu'
import { useTheme } from '@/theme.tsx'
import logoImg from '/logo.png'
import { NavLink } from 'react-router'

export const Header = ({ className = '' }: { className?: string }) => {
  const { currentTheme, toggleTheme } = useTheme()
  const darkModeClasses = 'dark:bg-gray-900 dark:border-0'
  const lightModeClasses = 'bg-white border-1 border-gray-200'

  return (
    <div
      className={`${className} ${lightModeClasses} ${darkModeClasses} shadow p-2 px-4 m-4 rounded-lg flex justify-between items-center`}
    >
      <div className="flex items-center gap-4">
        <img src={logoImg} height={32} width={36} />

        <NavLink to="/" end>
          <div className="text-gray-800 dark:text-white font-semibold mr-4">ReDoctor</div>
        </NavLink>

        <NavLink to="/dashboard" end>
          <div className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-md">
            Dashboard
          </div>
        </NavLink>
      </div>

      <div className="p-1 cursor-pointer" onClick={toggleTheme}>
        {currentTheme === 'light' ? (
          <LuMoon className="text-gray-800" size={24} />
        ) : (
          <LuSun className="text-gray-200" size={24} />
        )}
      </div>
    </div>
  )
}
