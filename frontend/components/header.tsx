import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          {/* Centered Logo */}
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"
              aria-label="Search Icon"
            >
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground select-none">
              LeadFinder
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
