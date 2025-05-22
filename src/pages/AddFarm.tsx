import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useFarmContext } from "@/providers/FarmProvider";
import { useUserContext } from "@/providers/UserAuthProvider";
import Step1 from "@/components/shared/Step1";
import Step2 from "@/components/shared/Step2";
import supabase from "@/config/supabase/supabase";
import Sidebar from "@/components/shared/Sidenav";

export default function AddFarm() {
    const { updateFarms, resetFarmCreationDetails, updateFarmDetails, farmCreationDetails } = useFarmContext();
    const { updateCreditScore, farmerProfile } = useUserContext();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const steps: { label: string; element: JSX.Element }[] = [
        { label: "Select Location", element: <Step1 /> },
        { label: "Set Parameters", element: <Step2 /> },
    ];

    console.log({farmCreationDetails});

    const handleNextStep = () => {
        updateFarmDetails("farmer_id", farmerProfile?.id ??"");
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        } else {
            submitFarm();
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    const submitFarm = async () => {
        if (submitting) return;

        if (!farmCreationDetails?.name || !farmCreationDetails?.crop_types) {
            toast.error("Provide farm name and crops");
            return;
        }

        try {
            setSubmitting(true);
            const { data: farm, error } = await supabase
                .from("farms")
                .insert([farmCreationDetails])
                .select()
                .single();

            if (farm) {
                updateFarms(farm);
                navigate("/dashboard");
                resetFarmCreationDetails();
                updateCreditScore(40);
                toast.success("Farm Added");
            } else if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            toast.error("Failed to add farm");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar/>
            <div className="md:ml-64 border min-h-screen flex flex-col">
            {steps.map((step, index) => (
            <div key={index} className={`${index === activeStep ? "block" : "hidden"} flex-grow`}>
            <CardContent className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-2">{step.label}</h3>
                <div className="flex-grow">{step.element}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                <Button
                    className="bg-green-600 cursor-pointer"
                    onClick={handleNextStep}
                    disabled={
                    !farmCreationDetails?.location?.length || submitting
                    }
                >
                    {activeStep === steps.length - 1
                    ? submitting
                        ? "Submitting..."
                        : "Finish"
                    : "Continue"}
                </Button>
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                >
                    Back
                </Button>
                </div>
            </CardContent>
            </div>
        ))}
        </div>

        </div>
    );
}
