import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, Check } from "lucide-react";

export default function AIDescriptionGenerator({ property, onDescriptionGenerated }) {
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [copied, setCopied] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const amenitiesList = property.amenities?.join(", ") || "modern amenities";
      
      const prompt = `Generate a compelling, professional vacation rental property description for a ${property.property_type || "luxury"} property with the following details:

Property Name: ${property.name}
Location: ${property.location}
Bedrooms: ${property.bedrooms}
Bathrooms: ${property.bathrooms}
Amenities: ${amenitiesList}
${property.pet_friendly ? "Pet-Friendly: Yes" : ""}
${property.wheelchair_accessible ? "Wheelchair Accessible: Yes" : ""}

Create an engaging description (200-250 words) that:
1. Highlights the property's unique features and luxury amenities
2. Emphasizes the location's attractions and nearby activities
3. Creates an emotional connection with potential guests
4. Uses descriptive, evocative language
5. Mentions the comfort and experience guests will have

Make it sound professional, inviting, and luxurious without being overly salesy.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt
      });

      return result;
    },
    onSuccess: (description) => {
      setGeneratedDescription(description);
      if (onDescriptionGenerated) {
        onDescriptionGenerated(description);
      }
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseDescription = async () => {
    await base44.entities.Property.update(property.id, {
      ai_description: generatedDescription
    });
    if (onDescriptionGenerated) {
      onDescriptionGenerated(generatedDescription);
    }
  };

  return (
    <Card className="mb-6 border-2 border-[#c4a574]/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#c4a574]" />
          <h3 className="text-lg font-medium text-gray-800">AI Description Generator</h3>
        </div>

        {!generatedDescription ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Generate a compelling, SEO-optimized description for this property using AI. 
              The description will highlight key features, amenities, and local attractions.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="bg-[#c4a574] hover:bg-[#b89968] text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateMutation.isPending ? "Generating..." : "Generate Description"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedDescription}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-[#c4a574] text-[#c4a574] hover:bg-[#c4a574]/10"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={handleUseDescription}
                className="bg-[#c4a574] hover:bg-[#b89968] text-white"
              >
                Use This Description
              </Button>
              <Button
                onClick={() => {
                  setGeneratedDescription("");
                  generateMutation.mutate();
                }}
                variant="outline"
              >
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}