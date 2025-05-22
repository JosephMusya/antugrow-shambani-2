"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import supabase from "@/config/supabase/supabase"
import { useUserContext } from "@/providers/UserAuthProvider"
import { type FarmerProfile } from "@/types/Types"

interface AddFarmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export default function EditProfileDialog({ open, onOpenChange }: AddFarmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)


  const {farmerProfile, updateProfile, updateCreditScore} = useUserContext();

  const [currentProfile, setCurrentProfile] = useState<FarmerProfile | undefined>(farmerProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof FarmerProfile ) => {
    setCurrentProfile((prev)=>({
      ...prev!,
      [key]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // setFormData((prev) => ({
    e.preventDefault();
    try {
      setIsSubmitting(true);
    const  {data, error} = await supabase.from("farmers").update({
      "full_name":currentProfile?.full_name,
      "bio": currentProfile?.bio,
      "phone": currentProfile?.phone,
      "experience_years": currentProfile?.experience_years
    }).
    eq('user_id', farmerProfile?.user_id).select().single()

    if(error){
      console.log(error);
      return
    }
    if(farmerProfile?.full_name === null && currentProfile?.full_name !== null){
      updateCreditScore(1);
    }

    updateProfile(data as unknown as FarmerProfile);
    onOpenChange(false);
    } finally{
      setIsSubmitting(false);
    }
  }

  useEffect(()=>{
    if(!farmerProfile)return;
    setCurrentProfile(farmerProfile);
  },[farmerProfile])

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Enter your profile information.</DialogDescription>
              {
                !farmerProfile?.full_name && <p className="text-[12px] text-red-400">• Your profile is missing your username</p> 
              }
              {
                !farmerProfile?.phone && <p className="text-[12px] text-red-400">• Your profile is missing a phone number</p> 
              }
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-start">
                  Farmer's Name
                </Label>
                <Input
                    id="name"
                    placeholder="Enter full names"
                    className="col-span-3"
                    required
                    defaultValue={farmerProfile?.full_name}
                    // value={formData.name}
                    onChange={(e)=>{
                      handleChange(e, "full_name")
                    }}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-start">
                  Phone
                </Label>
                <Input
                    id="phone"
                    placeholder="0712 345 678"
                    className="col-span-3"
                    required
                    defaultValue={farmerProfile?.phone}
                    // value={formData.location}
                    onChange={(e)=>{
                      handleChange(e, "phone")
                    }} />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="years" className="text-start">
                  Experience in years
                </Label>
                <Input
                    id="years"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0"
                    className="col-span-3"
                    required
                    defaultValue={farmerProfile?.experience_years}
                    // value={farmerProfile?.experience_years}
                     onChange={(e)=>{
                      handleChange(e, "experience_years")
                    }}   
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="bio" className="text-start pt-2">
                  Bio
                </Label>
                <Textarea
                    id="bio"
                    placeholder="Brief description of about you"
                    className="col-span-3"
                    rows={4}
                    defaultValue={farmerProfile?.bio}
                    // value={formData.description}
                     onChange={(e)=>{
                      handleChange(e, "bio")
                    }}   
                />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={(!farmerProfile?.full_name || !farmerProfile?.phone)} type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}
