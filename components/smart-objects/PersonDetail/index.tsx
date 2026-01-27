"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, MapPin, Heart, Users, Calendar, Award, MessageSquare, BookOpen, Briefcase } from "lucide-react";
import type { PersonDetailData } from "@/lib/mock-data/person-detail";

interface PersonDetailProps {
  person: PersonDetailData;
  className?: string;
}

const activityIcons = {
  meeting: MessageSquare,
  review: Calendar,
  training: BookOpen,
  project: Briefcase,
};

const activityColors = {
  meeting: "text-blue-400 bg-blue-500/10",
  review: "text-amber-400 bg-amber-500/10",
  training: "text-violet-400 bg-violet-500/10",
  project: "text-emerald-400 bg-emerald-500/10",
};

export function PersonDetail({ person, className }: PersonDetailProps) {
  const getEngagementColor = (engagement: number) => {
    if (engagement >= 90) return "text-green-500";
    if (engagement >= 80) return "text-lime-500";
    if (engagement >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      className={cn(
        "w-[960px] h-[540px] overflow-hidden rounded-2xl",
        "bg-gradient-to-b from-[#0a0a0a] to-[#000000]",
        "border border-[#1a1a1a]",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header Bar */}
      <div
        className="h-14 px-6 flex items-center justify-between"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-white">Employee Profile</h1>
          <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ background: "#111111" }}>
            {person.department}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">Active</span>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex h-[calc(100%-56px)]">
        {/* Left Column - Profile Info */}
        <motion.div
          className="w-[280px] p-5 flex flex-col"
          style={{ borderRight: "1px solid #1a1a1a" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
              style={{
                background: "linear-gradient(135deg, #111111 0%, #0a0a0a 100%)",
                border: "3px solid #10b981",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
              }}
            >
              {person.avatar ? (
                <img src={person.avatar} alt={person.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-emerald-400" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-white">{person.name}</h2>
            <p className="text-sm text-gray-400">{person.title}</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-5">
            <a
              href={`mailto:${person.email}`}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{person.email}</span>
            </a>
            {person.phone && (
              <a
                href={`tel:${person.phone}`}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{person.phone}</span>
              </a>
            )}
            {person.location && (
              <span className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{person.location}</span>
              </span>
            )}
          </div>

          {/* Certifications */}
          {person.certifications && person.certifications.length > 0 && (
            <div className="mt-auto">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {person.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Center Column - Metrics & Skills */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Metrics Row */}
          <motion.div
            className="flex gap-3 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Engagement */}
            <div
              className="flex-1 rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart className={cn("h-4 w-4", getEngagementColor(person.engagement))} />
                <span className="text-[10px] font-medium text-gray-400 uppercase">Engagement</span>
              </div>
              <div className={cn("text-2xl font-bold mb-2", getEngagementColor(person.engagement))}>
                {person.engagement}%
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                <motion.div
                  className={cn("h-full rounded-full", getEngagementColor(person.engagement).replace("text-", "bg-"))}
                  initial={{ width: 0 }}
                  animate={{ width: `${person.engagement}%` }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </div>
            </div>

            {/* Team Size */}
            <div
              className="flex-1 rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-medium text-gray-400 uppercase">Team Size</span>
              </div>
              <div className="text-2xl font-bold text-white">{person.teamSize}</div>
              <div className="text-[10px] text-gray-500">people</div>
            </div>

            {/* Tenure */}
            <div
              className="flex-1 rounded-xl p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-cyan-500" />
                <span className="text-[10px] font-medium text-gray-400 uppercase">Tenure</span>
              </div>
              <div className="text-2xl font-bold text-white">{person.tenure}</div>
              <div className="text-[10px] text-gray-500">with company</div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {person.skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.35 + index * 0.03 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] text-gray-300 border border-[#1a1a1a]"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* HR Notes */}
          {person.notes && (
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">HR Notes</h3>
              <p
                className="text-xs text-gray-400 italic p-3 rounded-lg"
                style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
              >
                "{person.notes}"
              </p>
            </motion.div>
          )}
        </div>

        {/* Right Column - Activity */}
        <motion.div
          className="w-[280px] p-5"
          style={{ borderLeft: "1px solid #1a1a1a" }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {person.recentActivity.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: "#0a0a0a", border: "1px solid #1a1a1a" }}
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 line-clamp-2">{activity.description}</p>
                    <span className="text-[10px] text-gray-500 mt-1 block">{formatDate(activity.date)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Direct Reports */}
          {person.directReports.length > 0 && (
            <div className="mt-5">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
                Direct Reports ({person.directReports.length})
              </h3>
              <div className="flex -space-x-2">
                {person.directReports.slice(0, 6).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "#111111",
                      border: "2px solid #0a0a0a",
                    }}
                  >
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
                {person.directReports.length > 6 && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-400"
                    style={{
                      background: "#111111",
                      border: "2px solid #0a0a0a",
                    }}
                  >
                    +{person.directReports.length - 6}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export { PersonHeader } from "./PersonHeader";
export { PersonMetrics } from "./PersonMetrics";
export { PersonSkills } from "./PersonSkills";
export { PersonActivity } from "./PersonActivity";
