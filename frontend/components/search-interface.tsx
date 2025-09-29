"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { LeadFilters } from "./lead-filters";
import { LeadResults } from "./lead-results";
import { ScrapingProgress } from "./scraping-progress";
import { HandleSearch } from "@/app/api/searchApis";

interface Person {
  id: string;
  name: string;
  title: string;
  location: string;
  company: string;
  profile_url: string;
  resume_url: string;
  score: number;
  skills: string[];
}

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [scrapingData, setScrapingData] = useState<{
    metadata: { totalResults: number; processingTime: string; query: string };
  } | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [filters, setFilters] = useState({});

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(false);

    try {
      const startTime = Date.now();
      const resp = await HandleSearch({ prompt: searchQuery });
      const peopleResp: Person[] = resp.data.response_data;

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      const metadata = {
        totalResults: peopleResp.length,
        processingTime: `${(duration/60).toFixed(2)} minutes`,
        query: searchQuery,
      };
      setScrapingData({ metadata });
      setPeople(peopleResp || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setPeople([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="e.g., 'Find Python developers with 2+ years of experience in Bangalore'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-base h-12"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-6"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search & Scrape
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSearching && <ScrapingProgress showResults={showResults} />}

      {showFilters && <LeadFilters onFiltersChange={setFilters} />}

      {showResults && (
        <LeadResults scrapingData={scrapingData} people={people} />
      )}
    </div>
  );
}
