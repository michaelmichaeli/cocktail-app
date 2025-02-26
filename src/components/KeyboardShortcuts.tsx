import { Keyboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function KeyboardShortcuts() {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLLabelElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !menuRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === "k" && e.altKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      if (e.key === "/" || e.key === "n") {
        setActiveKey(e.key);
        setIsOpen(false);
        setTimeout(() => setActiveKey(null), 750);
      } else if (e.key === "Escape") {
        if (isOpen) {
          setIsOpen(false);
          buttonRef.current?.focus();
        } else {
          setActiveKey(e.key);
          setTimeout(() => setActiveKey(null), 750);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) return;

      const menuItems = menuRef.current.querySelectorAll('[role="menuitem"]');
      const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);
      
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          buttonRef.current?.click();
          buttonRef.current?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            (menuItems[currentIndex - 1] as HTMLElement).focus();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < menuItems.length - 1) {
            (menuItems[currentIndex + 1] as HTMLElement).focus();
          }
          break;
        case "Home":
        case "PageUp":
          e.preventDefault();
          (menuItems[0] as HTMLElement).focus();
          break;
        case "End":
        case "PageDown":
          e.preventDefault();
          (menuItems[menuItems.length - 1] as HTMLElement).focus();
          break;
        case "Tab":
          e.preventDefault();
          break;
      }
    };

    menuRef.current?.addEventListener("keydown", handleKeyDown);
    return () => menuRef.current?.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMenuItemClick = (shortcut: string) => {
    setIsOpen(false);
    setActiveKey(shortcut);
    setTimeout(() => setActiveKey(null), 750);
    
    const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]');
    switch (shortcut) {
      case "/":
        searchInput?.focus();
        break;
      case "Esc":
        if (searchInput) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.blur();
        }
        break;
      case "N":
      case "n":
        navigate("/add");
        break;
    }
  };

  const menuItemClass = (key: string) => `
    flex justify-between items-center group 
    focus:outline-none hover:bg-base-300/30 focus:bg-base-300/50 
    focus:ring-2 focus:ring-inset focus:ring-primary/50 
    rounded-lg p-2 transition-all duration-200 cursor-pointer 
    hover:translate-x-0.5 active:scale-95 hover:shadow-sm focus:shadow-md
    ${(activeKey === key || (key === "N" && activeKey === "n")) ? "animate-highlight" : ""}
  `;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-base-100/10 backdrop-blur-[1px] pointer-events-none animate-fadeIn will-change-[opacity]"
        />
      )}
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          className={`dropdown dropdown-top dropdown-end ${isOpen ? 'dropdown-open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!(e.target as HTMLElement).closest('[role="menu"]')) {
              setIsOpen(prev => !prev);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const firstMenuItem = menuRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
              setTimeout(() => firstMenuItem?.focus(), 0);
            }
          }}
        >
          <label
            ref={buttonRef}
            tabIndex={0}
            className={`
              group btn btn-circle btn-ghost bg-base-200/50 hover:opacity-100 hover:scale-105 
              hover:bg-base-300/50 hover:shadow-lg focus:ring-2 focus:ring-primary/50 
              focus:ring-offset-2 focus:ring-offset-base-100 focus:outline-none 
              backdrop-blur-sm transition-all duration-300 ease-out active:scale-95 
              border border-base-300/50 relative overflow-hidden before:absolute
              before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
              before:bg-gradient-radial before:from-primary/20 before:via-transparent before:to-transparent
              before:scale-150 active:before:scale-100 before:origin-center
              ${isOpen ? 'bg-base-300/50 shadow-lg scale-105 before:opacity-100' : ''}
            `}
            aria-label="Show keyboard shortcuts"
            aria-haspopup="true"
            aria-expanded={isOpen}
            role="button"
          >
          <div className="relative">
            <div 
              data-tip="View keyboard shortcuts (Alt+K)" 
              className="tooltip tooltip-left"
            >
              <Keyboard 
                className={`
                  h-5 w-5 transition-all duration-300 ease-out transform
                  ${isOpen ? 'text-base-content scale-110' : 'text-base-content/70 group-hover:scale-110'}
                  group-active:scale-90
                `} 
              />
              <span className="sr-only">Toggle keyboard shortcuts menu</span>
            </div>
          </div>
          </label>
          <div
            ref={menuRef}
            className={`dropdown-content z-[1] p-4 shadow-xl bg-base-200/95 backdrop-blur-sm rounded-box w-72 text-sm space-y-2 border border-base-300/50 transform-gpu animate-slideUpAndFade transition-all duration-300 ease-out will-change-transform ${!isOpen ? 'opacity-0 pointer-events-none translate-y-1' : ''}`}
            role="menu"
            aria-label="Keyboard shortcuts menu"
          >
            <div className="mb-4 px-2 space-y-1">
              <h3 className="font-semibold text-base text-base-content/80">Keyboard Shortcuts</h3>
              <div className="mt-1 space-y-1.5 text-xs text-base-content/60">
                <p className="flex items-center gap-1.5">
                  Open menu with <kbd className="kbd kbd-xs">Alt</kbd>+<kbd className="kbd kbd-xs">K</kbd>
                </p>
                <p className="flex items-center gap-1.5">
                  Navigate with <kbd className="kbd kbd-xs">↑</kbd> <kbd className="kbd kbd-xs">↓</kbd>,
                  select with <kbd className="kbd kbd-xs">Enter</kbd>
                </p>
                <p className="flex items-center gap-1.5">
                  Close menu with <kbd className="kbd kbd-xs">Esc</kbd>
                </p>
              </div>
            </div>
            <div className="space-y-2 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-200/50 pointer-events-none opacity-50"></div>
              <div 
                tabIndex={0}
                className={menuItemClass("/")}
                role="menuitem"
                aria-label="Press '/' to focus search"
                onClick={() => handleMenuItemClick("/")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMenuItemClick("/");
                  }
                }}
              >
                <span className="text-base-content/70 group-hover:text-base-content transition-colors duration-200">Focus search</span>
                <kbd className="kbd kbd-sm min-w-[2rem] text-center bg-base-300/50 text-base-content/70 group-hover:bg-base-100 group-hover:shadow-md transition-all duration-200">/</kbd>
              </div>
              <div 
                tabIndex={0}
                className={menuItemClass("Escape")}
                role="menuitem"
                aria-label="Press 'Escape' to clear search"
                onClick={() => handleMenuItemClick("Esc")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMenuItemClick("Esc");
                  }
                }}
              >
                <span className="text-base-content/70 group-hover:text-base-content transition-colors duration-200">Clear search</span>
                <kbd className="kbd kbd-sm min-w-[2rem] text-center bg-base-300/50 text-base-content/70 group-hover:bg-base-100 group-hover:shadow-md transition-all duration-200">Esc</kbd>
              </div>
              <div
                tabIndex={0}
                className={menuItemClass("N")}
                role="menuitem"
                aria-label="Press 'N' to add new cocktail"
                onClick={() => handleMenuItemClick("N")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMenuItemClick("N");
                  }
                }}
              >
                <span className="text-base-content/70 group-hover:text-base-content transition-colors duration-200">New cocktail</span>
                <kbd className="kbd kbd-sm min-w-[2rem] text-center bg-base-300/50 text-base-content/70 group-hover:bg-base-100 group-hover:shadow-md transition-all duration-200">N</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
