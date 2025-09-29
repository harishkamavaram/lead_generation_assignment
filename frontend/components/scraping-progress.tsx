"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Globe, Database, Search, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function ScrapingProgress({ showResults }: { showResults: boolean }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      name: "Analyzing Query",
      icon: Search,
      description: "Processing search parameters",
    },
    {
      name: "Web Scraping",
      icon: Globe,
      description: "Extracting data from multiple sources",
    },
    {
      name: "Data Processing",
      icon: Database,
      description: "Cleaning and analyzing results",
    },
    {
      name: "Finalizing",
      icon: CheckCircle,
      description: "Preparing results for display",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;

        // Update current step based on progress
        if (newProgress >= 25 && currentStep < 1) setCurrentStep(1);
        if (newProgress >= 50 && currentStep < 2) setCurrentStep(2);
        if (newProgress >= 75 && currentStep < 3) setCurrentStep(3);

        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Searching in Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.name} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium text-sm ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            LinkedIn
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Company Websites
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Crunchbase
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            AngelList
          </Badge>
        </div> */}
      </CardContent>
    </Card>
  );
}
