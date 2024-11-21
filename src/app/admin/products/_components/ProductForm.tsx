"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { formatCurrency } from "@/lib/formatters";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct, deleteProduct, toggleProductAvailability } from "../../_actions/products";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase
}: {
  id: string,
  isAvailableForPurchase: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return <DropdownMenuItem
    disabled= {isPending}
    onClick={() => {
      startTransition(async () => {
        await toggleProductAvailability(id, !isAvailableForPurchase)
        router.refresh()
      })
    }}> { isAvailableForPurchase ? "Deactivate" : "Activate"} </DropdownMenuItem>
}

export function DeleteDropdownItem({
  id,
  disabled
}: {
  id: string,
  disabled: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return <DropdownMenuItem
    variant="destructive"
    disabled= {disabled || isPending}
    onClick={() => {
      startTransition(async () => {
        await deleteProduct(id)
        router.refresh()
      })
    }}> Delete </DropdownMenuItem>
}

export function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({}); // Track errors

  // Validation function
  const validateFields = (formData: FormData) => {
    const validationErrors: Record<string, string> = {};

    if (!formData.get("name") || formData.get("name")!.toString().trim() === "") {
      validationErrors.name = "Name is required.";
    }

    if (!formData.get("description") || formData.get("description")!.toString().trim() === "") {
      validationErrors.description = "Description is required.";
    }

    const price = Number(formData.get("priceInCents"));
    if (isNaN(price) || price <= 0) {
      validationErrors.priceInCents = "Price must be greater than 0.";
    }

    if (!formData.get("file")) {
      validationErrors.file = "File is required.";
    }

    if (!formData.get("img")) {
      validationErrors.img = "Image is required.";
    }

    return validationErrors;
  };

  return (
    <form
      action={async (formData) => {
        // Perform validation
        const validationErrors = validateFields(formData);

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors); // Display errors
          return;
        }

        // If no errors, submit the form
        setErrors({});
        await addProduct(formData);
      }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <Label htmlFor="name"> Name </Label>
        <Input type="text" id="name" name="name" required />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents"> Price in Cents </Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents || 0}
          onChange={(e) => setPriceInCents(Number(e.target.value) || 0)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {errors.priceInCents && <p className="text-red-500">{errors.priceInCents}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description"> Description </Label>
        <Textarea id="description" name="description" required />
        {errors.description && <p className="text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file"> File </Label>
        <Input type="file" id="file" name="file" required />
        {errors.file && <p className="text-red-500">{errors.file}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="img"> Image </Label>
        <Input type="file" id="img" name="img" required />
        {errors.img && <p className="text-red-500">{errors.img}</p>}
      </div>

      <Button type="submit"> Save Product </Button>
    </form>
  );
}
