"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBrandStore } from "@/store";

export default function AnalyticsPage() {
  const { campaigns, challenges, placements, coupons } = useBrandStore();

  // Calculate metrics
  const totalImpressions = placements.reduce((sum, p) => sum + p.impressions, 0) +
    campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = placements.reduce((sum, p) => sum + p.clicks, 0) +
    campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0);
  const totalCouponUses = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  // Mock weekly data for chart
  const weeklyData = [
    { day: "Mon", impressions: 12500, clicks: 850, conversions: 42 },
    { day: "Tue", impressions: 15200, clicks: 1020, conversions: 58 },
    { day: "Wed", impressions: 18300, clicks: 1180, conversions: 65 },
    { day: "Thu", impressions: 14800, clicks: 920, conversions: 48 },
    { day: "Fri", impressions: 19500, clicks: 1350, conversions: 72 },
    { day: "Sat", impressions: 22100, clicks: 1580, conversions: 88 },
    { day: "Sun", impressions: 16800, clicks: 1100, conversions: 55 },
  ];

  const maxImpressions = Math.max(...weeklyData.map((d) => d.impressions));

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track performance across all your campaigns
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-muted-foreground">Total Impressions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <MousePointer className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(totalClicks / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalConversions}</p>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgCTR.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Avg. CTR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="impressions">
              <TabsList className="mb-6">
                <TabsTrigger value="impressions">Impressions</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
                <TabsTrigger value="conversions">Conversions</TabsTrigger>
              </TabsList>

              <TabsContent value="impressions">
                <div className="h-64 flex items-end justify-between gap-2">
                  {weeklyData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.impressions / maxImpressions) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[20px]"
                      />
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="clicks">
                <div className="h-64 flex items-end justify-between gap-2">
                  {weeklyData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.clicks / Math.max(...weeklyData.map(d => d.clicks))) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg min-h-[20px]"
                      />
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="conversions">
                <div className="h-64 flex items-end justify-between gap-2">
                  {weeklyData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.conversions / Math.max(...weeklyData.map(d => d.conversions))) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg min-h-[20px]"
                      />
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{campaign.campaignName}</p>
                      <p className="text-xs text-muted-foreground">{campaign.brandName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{campaign.clicks.toLocaleString()} clicks</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.impressions > 0
                          ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
                          : 0}
                        % CTR
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Challenge Participants</span>
                    <span className="font-bold">{totalParticipants.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Coupon Redemptions</span>
                    <span className="font-bold">{totalCouponUses.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-bold">{conversionRate.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
                      style={{ width: `${Math.min(conversionRate * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

