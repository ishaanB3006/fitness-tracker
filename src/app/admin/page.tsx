"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandStore } from "@/store";

export default function AdminDashboard() {
  const { campaigns, challenges, placements, coupons } = useBrandStore();

  // Calculate totals
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const activeParticipants = challenges.reduce((sum, c) => sum + c.participants, 0);

  const stats = [
    {
      title: "Total Impressions",
      value: totalImpressions.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: MousePointer,
    },
    {
      title: "Conversions",
      value: totalConversions.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Spent",
      value: `$${(totalSpent / 1000).toFixed(1)}K`,
      change: "-2.1%",
      trend: "down",
      icon: DollarSign,
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your brand campaigns and performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={`flex items-center text-sm font-medium ${
                      stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{activeCampaigns}</p>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-violet-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{activeParticipants.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Challenge Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                >
                  <div>
                    <h4 className="font-medium">{campaign.campaignName}</h4>
                    <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : campaign.status === "completed"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {campaign.status}
                    </span>
                    <span className="text-muted-foreground">
                      ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

