import { Link, useLocation } from 'react-router-dom'
import { Wine, PlusCircle } from 'lucide-react'

export function Navbar() {
  const location = useLocation()

  return (
    <div className="navbar bg-base-100 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105 group"
          >
            <Wine className="h-6 w-6 text-primary transition-colors duration-200 group-hover:text-primary-dark" />
            <span className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cocktail App
            </span>
          </Link>
          
          <div className="hidden md:flex">
            <div className="tabs tabs-boxed bg-base-200/50 backdrop-blur-sm p-1">
              <Link 
                to="/" 
                className="tab transition-all duration-200 hover:bg-base-100 hover:text-primary data-[current=true]:bg-primary data-[current=true]:text-primary-foreground"
                data-current={location.pathname === '/'}
              >
                Browse
              </Link>
              <Link 
                to="/add" 
                className="tab transition-all duration-200 hover:bg-base-100 hover:text-primary data-[current=true]:bg-primary data-[current=true]:text-primary-foreground group"
                data-current={location.pathname === '/add'}
              >
                <PlusCircle className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                Add Cocktail
              </Link>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <Link to="/add">
            <button className="btn btn-circle btn-outline hover:bg-primary hover:text-white transition-all duration-200 group">
              <PlusCircle className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
