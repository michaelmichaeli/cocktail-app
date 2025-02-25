import { Link } from 'react-router-dom'
import { Wine, PlusCircle } from 'lucide-react'

export function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <Wine className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Cocktail App</span>
          </Link>
          
          <div className="hidden md:flex">
            <div className="tabs tabs-boxed bg-base-200">
              <Link to="/" className="tab">Browse</Link>
              <Link to="/add" className="tab">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Cocktail
              </Link>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <Link to="/add">
            <button className="btn btn-circle btn-outline">
              <PlusCircle className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
