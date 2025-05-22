import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFarmContext } from "../../providers/FarmProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { farmStages } from "@/utils/farms/farm";

export default function Step2() {
  const { updateFarmDetails, farmCreationDetails } = useFarmContext();

  return (
    <div className="flex flex-col mt-6 gap-4 max-w-xl w-full">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="farmName">Farm Name *</Label>
        <Input
          id="farmName"
          placeholder="Test Farm"
          value={farmCreationDetails?.name || ""}
          onChange={(e) => updateFarmDetails("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          placeholder="Nairobi"
          value={farmCreationDetails?.location_name || ""}
          onChange={(e) => updateFarmDetails("location_name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="crops">Crops</Label>
        <Input
          id="crops"
          placeholder="Maize, Potatoes"
          value={farmCreationDetails?.crop_types?.join(", ") || ""}
          onChange={(e) =>
            updateFarmDetails(
              "crop_types",
              e.target.value.split(",").map((crop) => crop.trim())
            )
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="farmStage">Farm Stage</Label>
        <Select
            onValueChange={(selectedStage) => {

            console.log(selectedStage)
                updateFarmDetails("farm_stage", farmStages[parseInt(selectedStage)]);
            }}
        >
            <SelectTrigger id="farmStage">
            <SelectValue placeholder="Select a farm stage" />
            </SelectTrigger>
            <SelectContent>
            {farmStages.map((stage) => (
                <SelectItem key={stage.stage} value={stage.stage.toString()}>
                {stage.value}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        </div>


      <div className="flex flex-col gap-1.5">
        <Label htmlFor="size">Farm Size - Acres</Label>
        <Input
          id="size"
          placeholder="1"
          readOnly
          tabIndex={-1}
          value={farmCreationDetails?.size_acres || ""}
          onFocus={(e) => e.target.blur()}
        />
      </div>
    </div>
  );
}
