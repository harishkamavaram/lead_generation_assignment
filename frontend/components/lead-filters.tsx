"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Building, Users, DollarSign } from "lucide-react"
import { useState } from "react"

interface LeadFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function LeadFilters({ onFiltersChange }: LeadFiltersProps) {
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    companySize: "",
    revenue: "",
    technologies: [] as string[],
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleTechnologyToggle = (tech: string, checked: boolean) => {
    const newTechnologies = checked ? [...filters.technologies, tech] : filters.technologies.filter((t) => t !== tech)

    handleFilterChange("technologies", newTechnologies)
  }

  const resetFilters = () => {
    const emptyFilters = {
      location: "",
      industry: "",
      companySize: "",
      revenue: "",
      technologies: [],
    }
    setFilters(emptyFilters)
    onFiltersChange?.(emptyFilters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          Advanced Scraping Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              placeholder="City, State, Country"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Company Size
            </Label>
            <Select value={filters.companySize} onValueChange={(value) => handleFilterChange("companySize", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Employee count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Revenue */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue Range
            </Label>
            <Select value={filters.revenue} onValueChange={(value) => handleFilterChange("revenue", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Annual revenue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1m">$0 - $1M</SelectItem>
                <SelectItem value="1m-10m">$1M - $10M</SelectItem>
                <SelectItem value="10m-100m">$10M - $100M</SelectItem>
                <SelectItem value="100m+">$100M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="space-y-3">
          <Label>Technology Stack (Scraped from websites)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["React", "WordPress", "Shopify", "Salesforce", "HubSpot", "Google Analytics", "AWS", "Stripe"].map(
              (tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech}
                    checked={filters.technologies.includes(tech)}
                    onCheckedChange={(checked) => handleTechnologyToggle(tech, checked as boolean)}
                  />
                  <Label htmlFor={tech} className="text-sm">
                    {tech}
                  </Label>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}
