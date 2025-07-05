
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, IndianRupee, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PricingCalculator = () => {
  const [landType, setLandType] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [acres, setAcres] = useState<string>("");
  const [gunthas, setGunthas] = useState<string>("");
  const [calculationType, setCalculationType] = useState<string>("rent");
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // Static pricing data for different land types and districts
  const staticPricingData = {
    coconut: {
      Hassan: { min: 300000, max: 800000, avg: 550000 },
      Shimoga: { min: 250000, max: 700000, avg: 475000 },
      Tumkur: { min: 400000, max: 900000, avg: 650000 }
    },
    areca: {
      Hassan: { min: 800000, max: 1500000, avg: 1150000 },
      Shimoga: { min: 600000, max: 1200000, avg: 900000 },
      Chikmagalur: { min: 700000, max: 1400000, avg: 1050000 }
    },
    paddy: {
      Hassan: { min: 200000, max: 500000, avg: 350000 },
      Mandya: { min: 250000, max: 600000, avg: 425000 }
    },
    vegetable: {
      Kolar: { min: 300000, max: 700000, avg: 500000 }
    },
    fruit: {
      Hassan: { min: 400000, max: 1000000, avg: 700000 }
    }
  };

  const getAvailableDistricts = (selectedLandType: string) => {
    if (!selectedLandType || !staticPricingData[selectedLandType as keyof typeof staticPricingData]) {
      return [];
    }
    return Object.keys(staticPricingData[selectedLandType as keyof typeof staticPricingData]);
  };

  const calculatePricing = () => {
    if (!landType || !district || !acres) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const totalAcres = parseFloat(acres) + (parseFloat(gunthas || "0") / 40);
    const pricing = staticPricingData[landType as keyof typeof staticPricingData]?.[district];
    
    if (!pricing) {
      toast({
        title: "No Data Available",
        description: "No pricing data available for selected land type and district",
        variant: "destructive",
      });
      return;
    }

    let calculations;
    
    switch (calculationType) {
      case "rent":
        calculations = {
          minTotal: (pricing.min * 0.05 * totalAcres).toFixed(0),
          maxTotal: (pricing.max * 0.08 * totalAcres).toFixed(0),
          avgTotal: (pricing.avg * 0.065 * totalAcres).toFixed(0),
          period: "per year",
          advance: (pricing.avg * 0.1 * totalAcres).toFixed(0)
        };
        break;
      case "lease":
        calculations = {
          minTotal: (pricing.min * 0.4 * totalAcres).toFixed(0),
          maxTotal: (pricing.max * 0.6 * totalAcres).toFixed(0),
          avgTotal: (pricing.avg * 0.5 * totalAcres).toFixed(0),
          period: "for 5 years",
          advance: "Full payment upfront"
        };
        break;
      case "sale":
        calculations = {
          minTotal: (pricing.min * totalAcres).toFixed(0),
          maxTotal: (pricing.max * totalAcres).toFixed(0),
          avgTotal: (pricing.avg * totalAcres).toFixed(0),
          period: "total price",
          advance: "Full ownership"
        };
        break;
      default:
        return;
    }

    setResults({
      ...calculations,
      totalAcres: totalAcres.toFixed(2),
      pricePerAcre: pricing.avg
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Smart Pricing Calculator</CardTitle>
          <CardDescription className="text-gray-600">
            Get accurate pricing estimates based on market data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="landType" className="text-base font-semibold mb-2 block">
                Land Type *
              </Label>
              <Select value={landType} onValueChange={(value) => {
                setLandType(value);
                setDistrict(""); // Reset district when land type changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coconut">Coconut</SelectItem>
                  <SelectItem value="areca">Areca</SelectItem>
                  <SelectItem value="paddy">Paddy</SelectItem>
                  <SelectItem value="vegetable">Vegetable</SelectItem>
                  <SelectItem value="fruit">Fruit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="district" className="text-base font-semibold mb-2 block">
                District *
              </Label>
              <Select value={district} onValueChange={setDistrict} disabled={!landType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDistricts(landType).map((dist) => (
                    <SelectItem key={dist} value={dist}>
                      {dist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="acres" className="text-base font-semibold mb-2 block">
                Area (Acres) *
              </Label>
              <Input
                id="acres"
                type="number"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                placeholder="Enter acres"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="gunthas" className="text-base font-semibold mb-2 block">
                Gunthas (Optional)
              </Label>
              <Input
                id="gunthas"
                type="number"
                value={gunthas}
                onChange={(e) => setGunthas(e.target.value)}
                placeholder="Enter gunthas (1 acre = 40 gunthas)"
                min="0"
                max="39"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="calculationType" className="text-base font-semibold mb-2 block">
                Calculation Type *
              </Label>
              <Select value={calculationType} onValueChange={setCalculationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rental (Annual)</SelectItem>
                  <SelectItem value="lease">Lease (5 Years)</SelectItem>
                  <SelectItem value="sale">Sale (Purchase)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={calculatePricing}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold rounded-full"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Pricing
            </Button>
          </div>

          {results && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                Pricing Estimate for {results.totalAcres} acres
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-blue-700 font-medium">Minimum</div>
                    <div className="text-xl font-bold text-blue-800 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {parseInt(results.minTotal).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-green-700 font-medium">Average</div>
                    <div className="text-xl font-bold text-green-800 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {parseInt(results.avgTotal).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-sm text-amber-700 font-medium">Maximum</div>
                    <div className="text-xl font-bold text-amber-800 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {parseInt(results.maxTotal).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center text-gray-700">
                  <p className="font-semibold">Calculation Details:</p>
                  <p>Total Area: {results.totalAcres} acres</p>
                  <p>Type: {calculationType.charAt(0).toUpperCase() + calculationType.slice(1)} {results.period}</p>
                  <p>Advance/Security: {results.advance}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCalculator;
