"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card" 
import {
  User,
  Building,
  MapPin, 
} from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    id: string
    name: string
    title: string
    location: string
    company: string
    profile_url: string
    resume_url: string
    score: number
    skills: string[]
  }
}

export function ProfileModal({ isOpen, onClose, contact }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const profileData = contact

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={`/.jpg?height=48&width=48&query=${contact.name} professional headshot`}
              />
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground">
                {profileData.title} at {profileData.company}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6"> */}
            <Card>
              {/* <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader> */}
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {profileData.company}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {profileData.skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* </TabsContent> */}

          {/* <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Add to CRM
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="resume" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Resume & Documents
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Resume Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Full resume with detailed work history, skills, and achievements
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Resume
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {profileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="justify-center">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        {/* </Tabs> */}
      </DialogContent>
    </Dialog>
  )
}
