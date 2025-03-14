import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ImageComparison from "./layers/image-comparison";

export default function ActiveImage() {
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const comparedLayers = useLayerStore((state) => state.comparedLayers);
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  );
  const layers = useLayerStore((state) => state.layers);
  console.log(comparedLayers);
  console.log(activeLayer);
  if (!activeLayer.url && comparedLayers.length === 0) return null;

  const renderLayer = (layer: Layer) => (
    <div className="relative w-full h-full items-center justify-center">
      {layer.resourceType === "image" && (
        <Image
          src={layer.url!}
          alt={layer.name!}
          fill={true}
          className={cn(
            "rounded-lg object-contain",
            generating ? "animate-pulse" : ""
          )}
        />
      )}
      {layer.resourceType === "video" && (
        <video
          src={layer.transcriptionURL || layer.url}
          width={layer.width}
          height={layer.height}
          controls
          className="rounded-lg object-contain max-w-full max-h-full"
        />
      )}
    </div>
  );

  if (layerComparisonMode && comparedLayers.length > 0) {
    const comparisonLayers = comparedLayers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean) as Layer[];
    return (
      <div className="w-full relative h-full p-24 bg-secondary flex flex-col items-center justify-center">
        <ImageComparison layers={comparisonLayers} />
      </div>
    );
  }

  return (
    <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  );
}
