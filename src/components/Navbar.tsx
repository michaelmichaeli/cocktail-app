import { Link, useLocation } from 'react-router-dom'
import { Wine, PlusCircle } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

export function Navbar() {
  const location = useLocation()

  return (
    <header className="border-b bg-background">
      <nav className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <Wine className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Cocktail App</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={cn(
                  "hover:bg-accent", 
                  location.pathname === "/" && "bg-accent"
                )}
              >
                Browse
              </Button>
            </Link>
            <Link to="/add">
              <Button 
                variant="ghost" 
                className={cn(
                  "hover:bg-accent", 
                  location.pathname === "/add" && "bg-accent"
                )}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Cocktail
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:hidden">
          <Link to="/add">
            <Button variant="outline" size="icon">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
