"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building,
  MapPin, 
  ExternalLink,
  Mail, 
  Clock,
} from "lucide-react";
import { ProfileModal } from "./profile-modal";
import { Input } from "./ui/input";
import { SendEmailWithCsv } from "@/app/api/searchApis";

export interface Person {
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

interface LeadResultsProps {
  scrapingData?: {
    metadata: {
      totalResults: number;
      processingTime: string;
      query: string;
    };
  } | null;
  people?: Person[];
}

export function LeadResults({ scrapingData, people }: LeadResultsProps) {
  const [selectedContact, setSelectedContact] = useState<{
    id: string;
    name: string;
    title: string;
    location: string;
    company: string;
    profile_url: string;
    resume_url: string;
    score: number;
    skills: string[];
  } | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const handleViewProfile = (person: Person) => {
    setSelectedContact(person);
  };
  const metadata = scrapingData?.metadata;

  const handleSendEmail = async () => {
    if(!email || email === "" || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter an email");
      return;
    }
    
    
    if(!people) {
      toast.error("No people found");
      return;
    }
    const response = await SendEmailWithCsv({ email, data: people || [] });
    console.log("Response in handleSendEmail :", response);
    if(response.status === 200) { 
      toast.success("Email sent successfully");
      setShowEmailModal(false);
      setEmail("");
    } else {
      toast.error("Failed to send email");
      setShowEmailModal(false);
      setEmail("");
    }
  };
  return (
    <>
      <div className="space-y-6">
        {metadata && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Scraping Results
                  </h2>
                  <p className="text-muted-foreground">
                    Found {metadata.totalResults} qualified Profiles for: "
                    {metadata.query}"
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button size="sm" onClick={() => setShowEmailModal(true)}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Info to Email
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Processing Time</p>
                    <p className="text-xs text-muted-foreground">
                      {metadata.processingTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data Quality</p>
                    <p className="text-xs text-muted-foreground">
                      Real-time verified ( Dummy Data )
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {people && people.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">People</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {people.map((p) => {
                const initials = p.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2);
                return (
                  <Card
                    key={p.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="" />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold text-foreground">
                                {p.name}
                              </p>
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary"
                              >
                                Score: {p.score}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {p.title}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{p.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(p)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Profile
                          </Button>
                          {/* <Button asChild size="sm">
                          <a
                            href={p.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Resume
                          </a>
                        </Button> */}
                        </div>
                      </div>

                      {p.skills?.length > 0 && (
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {p.skills.map((s) => (
                            <Badge key={s} variant="outline">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {selectedContact && (
          <ProfileModal
            isOpen={!!selectedContact}
            onClose={() => setSelectedContact(null)}
            contact={selectedContact}
          />
        )}
      </div>

      <Dialog
        open={showEmailModal}
        onOpenChange={() => setShowEmailModal(false)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Enter Email
            </DialogTitle>
            <DialogDescription>
              Enter the email address to send the information to.
            </DialogDescription>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={() => handleSendEmail()}>Send</Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
