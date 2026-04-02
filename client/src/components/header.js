"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const useAuth_1 = require("@/hooks/useAuth");
const wouter_1 = require("wouter");
const button_1 = require("@/components/ui/button");
const avatar_1 = require("@/components/ui/avatar");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const lucide_react_1 = require("lucide-react");
function Header() {
    const { user } = (0, useAuth_1.useAuth)();
    const [location] = (0, wouter_1.useLocation)();
    const isActive = (path) => {
        return location === path;
    };
    const handleLogout = () => {
        window.location.href = "/api/logout";
    };
    const userInitials = (user === null || user === void 0 ? void 0 : user.firstName) && (user === null || user === void 0 ? void 0 : user.lastName)
        ? `${user.firstName[0]}${user.lastName[0]}`
        : (user === null || user === void 0 ? void 0 : user.firstName)
            ? user.firstName[0]
            : (user === null || user === void 0 ? void 0 : user.email)
                ? user.email[0].toUpperCase()
                : "U";
    return (<header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-[var(--mindtune-neutral-200)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <wouter_1.Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-xl flex items-center justify-center">
                <lucide_react_1.Brain className="w-6 h-6 text-white"/>
              </div>
              <h1 className="text-xl font-semibold text-[var(--mindtune-neutral-800)]">MindTune</h1>
            </div>
          </wouter_1.Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <wouter_1.Link href="/">
              <span className={`cursor-pointer transition-colors ${isActive('/')
            ? 'text-[var(--mindtune-primary)] font-medium'
            : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'}`}>
                Dashboard
              </span>
            </wouter_1.Link>
            <wouter_1.Link href="/mood-check">
              <span className={`cursor-pointer transition-colors ${isActive('/mood-check')
            ? 'text-[var(--mindtune-primary)] font-medium'
            : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'}`}>
                Check-in
              </span>
            </wouter_1.Link>
            <wouter_1.Link href="/history">
              <span className={`cursor-pointer transition-colors ${isActive('/history')
            ? 'text-[var(--mindtune-primary)] font-medium'
            : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'}`}>
                History
              </span>
            </wouter_1.Link>
            <wouter_1.Link href="/support">
              <span className={`cursor-pointer transition-colors ${isActive('/support')
            ? 'text-[var(--mindtune-primary)] font-medium'
            : 'text-[var(--mindtune-neutral-600)] hover:text-[var(--mindtune-primary)]'}`}>
                Support
              </span>
            </wouter_1.Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button_1.Button variant="ghost" size="sm" className="relative">
              <lucide_react_1.Bell className="w-5 h-5 text-[var(--mindtune-neutral-600)]"/>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--mindtune-accent)] rounded-full"></span>
            </button_1.Button>
            
            <dropdown_menu_1.DropdownMenu>
              <dropdown_menu_1.DropdownMenuTrigger asChild>
                <button_1.Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <avatar_1.Avatar className="h-10 w-10">
                    <avatar_1.AvatarImage src={user === null || user === void 0 ? void 0 : user.profileImageUrl} alt={(user === null || user === void 0 ? void 0 : user.firstName) || "User"}/>
                    <avatar_1.AvatarFallback className="bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] text-white">
                      {userInitials}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>
                </button_1.Button>
              </dropdown_menu_1.DropdownMenuTrigger>
              
              <dropdown_menu_1.DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {(user === null || user === void 0 ? void 0 : user.firstName) ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user === null || user === void 0 ? void 0 : user.email}
                  </p>
                </div>
                
                <dropdown_menu_1.DropdownMenuSeparator />
                
                <dropdown_menu_1.DropdownMenuItem className="cursor-pointer">
                  <lucide_react_1.User className="mr-2 h-4 w-4"/>
                  <span>Profile</span>
                </dropdown_menu_1.DropdownMenuItem>
                
                <dropdown_menu_1.DropdownMenuItem className="cursor-pointer">
                  <lucide_react_1.Settings className="mr-2 h-4 w-4"/>
                  <span>Settings</span>
                </dropdown_menu_1.DropdownMenuItem>
                
                <dropdown_menu_1.DropdownMenuSeparator />
                
                <dropdown_menu_1.DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <lucide_react_1.LogOut className="mr-2 h-4 w-4"/>
                  <span>Log out</span>
                </dropdown_menu_1.DropdownMenuItem>
              </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>
          </div>
        </div>
      </div>
    </header>);
}
