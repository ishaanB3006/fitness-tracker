"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Search, Eye, MousePointer, Edit, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandStore } from "@/store";
import { ProductPlacement } from "@/cms/types";

const placementLocations = [
  { value: "workout-detail", label: "Workout Detail Page" },
  { value: "meal-plan", label: "Meal Plan Page" },
  { value: "home", label: "Home Feed" },
  { value: "post-workout", label: "Post-Workout Screen" },
];

const productTypes = [
  { value: "supplement", label: "Supplement" },
  { value: "equipment", label: "Equipment" },
  { value: "apparel", label: "Apparel" },
  { value: "food", label: "Food" },
  { value: "app", label: "App" },
  { value: "other", label: "Other" },
];

export default function PlacementsPage() {
  const { placements, addPlacement, updatePlacement, deletePlacement, togglePlacementActive } = useBrandStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<ProductPlacement | null>(null);

  const [formData, setFormData] = useState({
    productName: "",
    productType: "supplement" as ProductPlacement["productType"],
    placementLocation: "home" as ProductPlacement["placementLocation"],
    linkUrl: "",
    imageUrl: "",
  });

  const filteredPlacements = placements.filter((p) =>
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingPlacement) {
      updatePlacement(editingPlacement.id, formData);
    } else {
      const newPlacement: ProductPlacement = {
        id: `pp-${Date.now()}`,
        brandId: "bc1",
        ...formData,
        impressions: 0,
        clicks: 0,
        isActive: true,
      };
      addPlacement(newPlacement);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productType: "supplement",
      placementLocation: "home",
      linkUrl: "",
      imageUrl: "",
    });
    setEditingPlacement(null);
  };

  const openEdit = (placement: ProductPlacement) => {
    setEditingPlacement(placement);
    setFormData({
      productName: placement.productName,
      productType: placement.productType,
      placementLocation: placement.placementLocation,
      linkUrl: placement.linkUrl,
      imageUrl: placement.imageUrl,
    });
    setIsDialogOpen(true);
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
            <h1 className="text-3xl font-bold mb-2">Product Placements</h1>
            <p className="text-muted-foreground">
              Manage product placements across the app
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Placement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPlacement ? "Edit Placement" : "Create New Placement"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="Premium Protein Powder"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) => setFormData({ ...formData, productType: value as ProductPlacement["productType"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Placement Location</Label>
                  <Select
                    value={formData.placementLocation}
                    onValueChange={(value) => setFormData({ ...formData, placementLocation: value as ProductPlacement["placementLocation"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {placementLocations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://example.com/product"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingPlacement ? "Save Changes" : "Create Placement"}
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
            placeholder="Search placements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Placements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlacements.map((placement, index) => (
          <motion.div
            key={placement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden ${!placement.isActive ? "opacity-60" : ""}`}>
              <div className="relative h-40">
                <Image
                  src={placement.imageUrl}
                  alt={placement.productName}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Switch
                    checked={placement.isActive}
                    onCheckedChange={() => togglePlacementActive(placement.id)}
                  />
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{placement.productName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize text-xs">
                        {placement.productType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {placement.placementLocation.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {placement.impressions.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointer className="h-3.5 w-3.5" />
                    {placement.clicks.toLocaleString()}
                  </span>
                  <span>
                    {placement.impressions > 0
                      ? ((placement.clicks / placement.impressions) * 100).toFixed(1)
                      : 0}
                    % CTR
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1 mt-4">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(placement)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deletePlacement(placement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

