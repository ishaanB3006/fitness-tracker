"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Copy, Edit, Trash2, Tag, Percent, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
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
import { Coupon } from "@/cms/types";

export default function CouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponActive } = useBrandStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    expiresAt: "",
  });

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        minPurchase: formData.minPurchase ? parseInt(formData.minPurchase) : undefined,
        maxUses: parseInt(formData.maxUses),
        expiresAt: formData.expiresAt,
      });
    } else {
      const newCoupon: Coupon = {
        id: `c-${Date.now()}`,
        brandId: "bc1",
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        minPurchase: formData.minPurchase ? parseInt(formData.minPurchase) : undefined,
        maxUses: parseInt(formData.maxUses),
        usedCount: 0,
        expiresAt: formData.expiresAt,
        isActive: true,
      };
      addCoupon(newCoupon);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minPurchase: "",
      maxUses: "",
      expiresAt: "",
    });
    setEditingCoupon(null);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minPurchase: coupon.minPurchase ? String(coupon.minPurchase) : "",
      maxUses: String(coupon.maxUses),
      expiresAt: coupon.expiresAt,
    });
    setIsDialogOpen(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could add toast notification here
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
            <h1 className="text-3xl font-bold mb-2">Coupons & Offers</h1>
            <p className="text-muted-foreground">
              Create discount codes for your products
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="20% off your first order"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value) => setFormData({ ...formData, discountType: value as "percentage" | "fixed" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Value</Label>
                    <Input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.discountType === "percentage" ? "20" : "50"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min. Purchase ($)</Label>
                    <Input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Uses</Label>
                    <Input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expires At</Label>
                  <Input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
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
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon, index) => {
          const usagePercent = (coupon.usedCount / coupon.maxUses) * 100;
          const isExpired = new Date(coupon.expiresAt) < new Date();
          
          return (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`overflow-hidden ${!coupon.isActive || isExpired ? "opacity-60" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        coupon.discountType === "percentage"
                          ? "bg-purple-100 dark:bg-purple-900/30"
                          : "bg-emerald-100 dark:bg-emerald-900/30"
                      }`}>
                        {coupon.discountType === "percentage" ? (
                          <Percent className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {coupon.discountType === "percentage" 
                            ? `${coupon.discountValue}%` 
                            : `$${coupon.discountValue}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.discountType === "percentage" ? "off" : "discount"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={coupon.isActive && !isExpired}
                      onCheckedChange={() => toggleCouponActive(coupon.id)}
                      disabled={isExpired}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 px-3 py-2 bg-muted rounded-lg font-mono text-sm">
                      {coupon.code}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyCode(coupon.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{coupon.description}</p>

                  {coupon.minPurchase && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Min. purchase: ${coupon.minPurchase}
                    </p>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Usage</span>
                      <span>{coupon.usedCount} / {coupon.maxUses}</span>
                    </div>
                    <Progress value={usagePercent} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : !coupon.isActive ? (
                        <Badge variant="secondary">Inactive</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Expires: {coupon.expiresAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteCoupon(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

