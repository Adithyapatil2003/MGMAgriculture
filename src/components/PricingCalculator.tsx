
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, IndianRupee, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PricingCalculator = () => {
  const [acres, setAcres] = useState<string>("");
  const [gunthas, setGunthas] = useState<string>("");
  const [calculationType, setCalculationType] = useState<string>("rent");
  const [priceRange, setPriceRange] = useState<number[]>([25000]);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  // Updated pricing ranges as per your specifications
  const pricingRanges = {
    rent: {
      min: 25000,
      max: 50000,
      unit: "per acre/year",
      description: "Annual rental price per acre"
    },
    lease: {
      min: 500000, // ₹5 lakhs
      max: 1000000, // ₹10 lakhs
      unit: "per acre for 5 years",
      description: "5-year lease price per acre"
    },
    sale: {
      min: 150000, // ₹1.5 lakhs per guntha
      max: 250000, // ₹2.5 lakhs per guntha
      unit: "per guntha",
      description: "Sale price per guntha"
    }
  };

  // Format number in Indian system (crore, lakh, thousand)
  const formatIndianNumber = (num: number): string => {
    if (num >= 10000000) { // 1 crore
      return `${(num / 10000000).toFixed(2)} crore`;
    } else if (num >= 100000) { // 1 lakh
      return `${(num / 100000).toFixed(2)} lakh`;
    } else if (num >= 1000) { // 1 thousand
      return `${(num / 1000).toFixed(0)} thousand`;
    } else if (num >= 100) { // hundreds
      return `${(num / 100).toFixed(0)} hundred`;
    }
    return num.toString();
  };

  // Format number with commas for digit display
  const formatWithCommas = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  const getCurrentPricing = () => {
    return pricingRanges[calculationType as keyof typeof pricingRanges];
  };

  const handleCalculationTypeChange = (type: string) => {
    setCalculationType(type);
    const pricing = pricingRanges[type as keyof typeof pricingRanges];
    setPriceRange([pricing.min]);
  };

  const handleAcresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow whole numbers for acres
    if (value === "" || /^\d+$/.test(value)) {
      setAcres(value);
    }
  };

  const handleGunthasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 40)) {
      setGunthas(value);
    } else if (parseInt(value) > 40) {
      toast({
        title: "Invalid Input",
        description: "Gunthas cannot exceed 40 (1 acre = 40 gunthas)",
        variant: "destructive",
      });
    }
  };

  const calculatePricing = () => {
    if (!acres) {
      toast({
        title: "Missing Information",
        description: "Please fill in the number of acres",
        variant: "destructive",
      });
      return;
    }

    const totalAcres = parseFloat(acres) + (parseFloat(gunthas || "0") / 40);
    const selectedPrice = priceRange[0];
    const pricing = getCurrentPricing();

    let calculations;
    
    switch (calculationType) {
      case "rent":
        calculations = {
          selectedPrice: selectedPrice,
          totalCost: (selectedPrice * totalAcres).toFixed(0),
          period: "per year",
          advance: "1 lakh", // Fixed ₹1 lakh for rent
          unit: "per acre",
          showAdvance: true
        };
        break;
      case "lease":
        calculations = {
          selectedPrice: selectedPrice,
          totalCost: (selectedPrice * totalAcres).toFixed(0),
          period: "for 5 years",
          advance: "",
          unit: "per acre",
          showAdvance: false
        };
        break;
      case "sale":
        const totalGunthas = totalAcres * 40;
        calculations = {
          selectedPrice: selectedPrice,
          totalCost: (selectedPrice * totalGunthas).toFixed(0),
          period: "total price",
          advance: "",
          unit: "per guntha",
          showAdvance: false
        };
        break;
      default:
        return;
    }

    setResults({
      ...calculations,
      totalAcres: totalAcres.toFixed(2),
      totalGunthas: (totalAcres * 40).toFixed(0),
      calculationType: calculationType,
      acresInput: acres,
      gunthasInput: gunthas || "0"
    });
  };

  const currentPricing = getCurrentPricing();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Agricultural Land Pricing Calculator</CardTitle>
          <CardDescription className="text-gray-600">
            Calculate pricing for rent, lease, or purchase of agricultural land
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="calculationType" className="text-base font-semibold mb-2 block">
                Calculation Type *
              </Label>
              <Select value={calculationType} onValueChange={handleCalculationTypeChange}>
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

            <div>
              <Label htmlFor="acres" className="text-base font-semibold mb-2 block">
                Acres *
              </Label>
              <Input
                id="acres"
                type="text"
                value={acres}
                onChange={handleAcresChange}
                placeholder="Enter acres (whole numbers only)"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="gunthas" className="text-base font-semibold mb-2 block">
                Gunthas (max 40)
              </Label>
              <Input
                id="gunthas"
                type="text"
                value={gunthas}
                onChange={handleGunthasChange}
                placeholder="Enter gunthas (0-40)"
                min="0"
                max="40"
              />
            </div>

            <div className="md:col-span-3">
              <Label className="text-base font-semibold mb-4 block">
                Price Range: ₹{formatWithCommas(priceRange[0])} {currentPricing.unit}
              </Label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{formatWithCommas(currentPricing.min)}</span>
                  <span>₹{formatWithCommas(currentPricing.max)}</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={currentPricing.max}
                  min={currentPricing.min}
                  step={calculationType === "sale" ? 5000 : 5000}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">{currentPricing.description}</p>
              </div>
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
                Pricing Estimate for {results.totalAcres} acres ({results.totalGunthas} gunthas)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-blue-700 font-medium">Selected Price</div>
                    <div className="text-xl font-bold text-blue-800 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatWithCommas(parseInt(results.selectedPrice))}
                    </div>
                    <div className="text-xs text-blue-600">{results.unit}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-green-700 font-medium">Total Cost</div>
                    <div className="text-xl font-bold text-green-800 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {formatWithCommas(parseInt(results.totalCost))}
                    </div>
                    <div className="text-xs text-green-600">{results.period}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center text-gray-700">
                  <p className="font-semibold">Calculation Details:</p>
                  <p>Total Area: {results.acresInput} acres {results.gunthasInput} gunthas = {results.totalAcres} acres ({results.totalGunthas} gunthas)</p>
                  <p>Type: {results.calculationType.charAt(0).toUpperCase() + results.calculationType.slice(1)} {results.period}</p>
                  {results.showAdvance && (
                    <p>Advance/Security: ₹{results.advance}</p>
                  )}
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
