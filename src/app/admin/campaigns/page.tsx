"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBrandStore } from "@/store";
import { BrandCampaign } from "@/cms/types";

export default function CampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useBrandStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<BrandCampaign | null>(null);

  const [formData, setFormData] = useState({
    brandName: "",
    campaignName: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        brandName: formData.brandName,
        campaignName: formData.campaignName,
        budget: parseInt(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
    } else {
      const newCampaign: BrandCampaign = {
        id: `bc-${Date.now()}`,
        brandName: formData.brandName,
        campaignName: formData.campaignName,
        budget: parseInt(formData.budget),
        spent: 0,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "draft",
        impressions: 0,
        clicks: 0,
        conversions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addCampaign(newCampaign);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      brandName: "",
      campaignName: "",
      budget: "",
      startDate: "",
      endDate: "",
    });
    setEditingCampaign(null);
  };

  const openEdit = (campaign: BrandCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      brandName: campaign.brandName,
      campaignName: campaign.campaignName,
      budget: String(campaign.budget),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "paused":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage your brand advertising campaigns
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                    placeholder="Enter brand name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input
                    value={formData.campaignName}
                    onChange={(e) =>
                      setFormData({ ...formData, campaignName: e.target.value })
                    }
                    placeholder="Enter campaign name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Budget ($)</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder="Enter budget"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingCampaign ? "Save Changes" : "Create Campaign"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({campaigns.filter((c) => c.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({campaigns.filter((c) => c.status === "draft").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({campaigns.filter((c) => c.status === "completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{campaign.campaignName}</h3>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {campaign.brandName} • {campaign.startDate} to {campaign.endDate}
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Spent</p>
                            <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Impressions</p>
                            <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Clicks</p>
                            <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conversions</p>
                            <p className="font-medium">{campaign.conversions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(campaign)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {campaign.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCampaign(campaign.id, { status: "paused" })}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : campaign.status === "paused" || campaign.status === "draft" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCampaign(campaign.id, { status: "active" })}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            {filteredCampaigns
              .filter((c) => c.status === "active")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{campaign.campaignName}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="space-y-4">
            {filteredCampaigns
              .filter((c) => c.status === "draft")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{campaign.campaignName}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            {filteredCampaigns
              .filter((c) => c.status === "completed")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{campaign.campaignName}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.brandName}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

