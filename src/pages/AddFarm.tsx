import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useFarmContext } from "@/providers/FarmProvider";
import { useUserContext } from "@/providers/UserAuthProvider";
import Step1 from "@/components/shared/Step1";
import Step2 from "@/components/shared/Step2";
import supabase from "@/config/supabase/supabase";
import Sidebar from "@/components/shared/Sidenav";
import type { Coordinate, FarmType } from "@/types/Types";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Check, Loader2, X } from "lucide-react";

export default function AddFarm() {
    type LogType = {
        message: string,
        type: "OK"|"NOK"
    }
    const { updateFarms, resetFarmCreationDetails, updateFarmDetails, farmCreationDetails, retrieveFarms } = useFarmContext();
    const { updateCreditScore, farmerProfile } = useUserContext();
    const navigate = useNavigate();

    const [creationStep, setCreationStep] = useState<number>(0);
    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showCreationDialog, setShowCreationDialog] = useState(false);
    const [creationLogs, setCreationLogs] = useState<LogType[]>([]);

    const steps: { label: string; element: JSX.Element }[] = [
        { label: "Set location of your farm", element: <Step1 /> },
        { label: "Set Parameters", element: <Step2 /> },
    ];

    const addLog = (log: LogType) => {
        setCreationLogs((prev) => [...prev, log]);
        console.log(creationStep);
    };

    const handleNextStep = () => {
        updateFarmDetails("farmer_id", farmerProfile?.id ?? "");
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
            setShowCreationDialog(true);
            setCreationStep(1);
            addLog({message:"Retrieving farm Data", type:"OK"});

            const { data: farm, error }: PostgrestSingleResponse<FarmType> = await supabase
                .from("farms")
                .insert([farmCreationDetails])
                .select()
                .single();

            setCreationStep(2);
            addLog({message:"Initializing processing", type:"OK"
            });

            if (farm) {
                updateFarms(farm);

                if (farm.location) {
                    try {
                        
                        addLog({message:"Processing weather information", type:"OK"});
                        
                        await fetch(`${import.meta.env.VITE_BASE_URL}/weather-data?lat=${farm.location[0].lat}&lon=${farm.location[0].lng}&farm_id=${farm.id}`);

                        const farmLocation = farm?.location as Coordinate[];

                        const transformedCoordinates = farmLocation?.map((coord) => [
                        coord.lng,
                        coord.lat,
                        ]);

                        // Send as JSON string
                        const locationParam = JSON.stringify([transformedCoordinates]); // note the extra array to wrap into a polygon

                        addLog({message:"Processing satellite information", type:"OK"});

                        await fetch(
                        `${import.meta.env.VITE_BASE_URL}/satellite-data?location=${encodeURIComponent(locationParam)}&farm_id=${farm.id}`
                        );

                        addLog({message:"Farm creation complete", type:"OK"});
                        setCreationStep(3);

                        retrieveFarms();
                        updateCreditScore(5);
                        toast.success("Farm Added");

                        setTimeout(() => {
                            setCreationStep(0);
                            resetFarmCreationDetails();
                            setShowCreationDialog(false);
                            navigate("/");
                        }, 2000);
                    } catch (error) {
                        addLog({message:"Error fetching metadata", type:"NOK"});
                        console.error(error);
                    }
                }
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
            <Sidebar />
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
                                    disabled={!farmCreationDetails?.location?.length || submitting}
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

            {/* AlertDialog using shadcn */}
            <AlertDialog open={showCreationDialog}>
                <AlertDialogContent className="max-w-md bg-white shadow-xl border rounded-lg">
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        Creating Farm...
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="max-h-64 overflow-y-auto space-y-1 text-sm text-gray-700">
                        {creationLogs.map((log, i) => (
                            <p key={i} className="flex items-center gap-2"> {log.type==="NOK"?<X className="text-red-500" size={15}/>:  <Check className="text-green-500" size={15}/>} {log.message}</p>
                        ))}
                        </div>
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => setShowCreationDialog(false)}>
                        Close
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

        </div>
    );
}
