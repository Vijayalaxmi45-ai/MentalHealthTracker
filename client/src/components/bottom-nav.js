"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BottomNav;
const wouter_1 = require("wouter");
const lucide_react_1 = require("lucide-react");
function BottomNav() {
    const [location] = (0, wouter_1.useLocation)();
    const isActive = (path) => {
        return location === path;
    };
    return (<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[var(--mindtune-neutral-200)] px-4 py-2">
      <div className="flex justify-around items-center">
        <wouter_1.Link href="/">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${isActive('/')
            ? 'text-[var(--mindtune-primary)]'
            : 'text-[var(--mindtune-neutral-400)]'}`}>
            <lucide_react_1.Home className="w-5 h-5"/>
            <span className="text-xs font-medium">Home</span>
          </div>
        </wouter_1.Link>
        
        <wouter_1.Link href="/mood-check">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${isActive('/mood-check')
            ? 'text-[var(--mindtune-primary)]'
            : 'text-[var(--mindtune-neutral-400)]'}`}>
            <lucide_react_1.Heart className="w-5 h-5"/>
            <span className="text-xs font-medium">Check-in</span>
          </div>
        </wouter_1.Link>
        
        <wouter_1.Link href="/history">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${isActive('/history')
            ? 'text-[var(--mindtune-primary)]'
            : 'text-[var(--mindtune-neutral-400)]'}`}>
            <lucide_react_1.TrendingUp className="w-5 h-5"/>
            <span className="text-xs font-medium">Insights</span>
          </div>
        </wouter_1.Link>
        
        <wouter_1.Link href="/support">
          <div className={`flex flex-col items-center space-y-1 py-2 px-3 cursor-pointer ${isActive('/support')
            ? 'text-[var(--mindtune-primary)]'
            : 'text-[var(--mindtune-neutral-400)]'}`}>
            <lucide_react_1.Users className="w-5 h-5"/>
            <span className="text-xs font-medium">Support</span>
          </div>
        </wouter_1.Link>
      </div>
    </nav>);
}
