"use client"

import ApplicationHero from "@/components/Applications/ApplicationHero";
import ApplicationScrollable from "@/components/Applications/ApplicationScrollable";
import ApplicationAssistance from "@/components/Applications/ApplicationAssistance";

export default function ApplicationsPage() {
    return(
        <div className="min-h-screen bg-gray-50">
              <ApplicationHero />
        
              <ApplicationScrollable />
        
              <ApplicationAssistance />
            </div>
    )
}