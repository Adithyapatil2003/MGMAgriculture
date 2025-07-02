
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, IndianRupee } from "lucide-react";

interface CalculationResult {
  totalCost: number;
  monthlyPayment?: number;
  advancePayment?: number;
  description: string;
}

const PricingCalculator = () => {
  const [acres, setAcres] = useState([1]);
  const [gunthas, setGunthas] = useState(0);
  const [calculationType, setCalculationType] = useState('rent');
  const [rentDuration, setRentDuration] = useState(1);
  const [leaseDuration, setLeaseDuration] = useState(3);
  
  // Price range sliders
  const [rentPrice, setRentPrice] = useState([37500]); // Default to middle of 25,000-50,000
  const [leasePrice, setLeasePrice] = useState([750000]); // Default to middle of 5-10 lakhs
  const [salePrice, setSalePrice] = useState([200000]); // Default to middle of 1.5-2.5 lakhs per guntha
  
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Pricing ranges
  const pricing = {
    rent: { min: 25000, max: 50000, advance: 100000 },
    lease: { min: 500000, max: 1000000 }, // 5-10 lakhs per acre
    sale: { min: 150000, max: 250000 } // 1.5-2.5 lakhs per guntha
  };

  const calculatePrice = () => {
    const totalAcres = acres[0] + (gunthas / 40); // 40 gunthas = 1 acre
    const totalGunthas = (totalAcres * 40);
    let calculationResult: CalculationResult;

    switch (calculationType) {
      case 'rent':
        const selectedRentPrice = rentPrice[0];
        const annualRent = selectedRentPrice * totalAcres;
        const totalRentCost = annualRent * rentDuration;
        calculationResult = {
          totalCost: totalRentCost,
          monthlyPayment: annualRent / 12,
          advancePayment: pricing.rent.advance,
          description: `${rentDuration} year(s) rental for ${totalAcres.toFixed(2)} acres at ₹${selectedRentPrice.toLocaleString()}/acre/year`
        };
        break;

      case 'lease':
        const selectedLeasePrice = leasePrice[0];
        const leaseCost = selectedLeasePrice * totalAcres * (leaseDuration / 3); // Base price is for 3 years
        calculationResult = {
          totalCost: leaseCost,
          description: `${leaseDuration} year lease for ${totalAcres.toFixed(2)} acres at ₹${selectedLeasePrice.toLocaleString()}/acre for 3 years`
        };
        break;

      case 'sale':
        const selectedSalePrice = salePrice[0];
        const purchaseCost = selectedSalePrice * totalGunthas;
        calculationResult = {
          totalCost: purchaseCost,
          description: `Purchase of ${totalAcres.toFixed(2)} acres (${totalGunthas.toFixed(0)} gunthas) at ₹${selectedSalePrice.toLocaleString()}/guntha`
        };
        break;

      default:
        calculationResult = {
          totalCost: 0,
          description: 'Please select a calculation type'
        };
    }

    setResult(calculationResult);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crores`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Pricing Calculator
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Calculate costs for rent, lease, or purchase of agricultural land
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Land Area Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Land Area</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="acres" className="text-base font-medium mb-3 block">
                  Acres: {acres[0]}
                </Label>
                <Slider
                  id="acres"
                  min={1}
                  max={19}
                  step={1}
                  value={acres}
                  onValueChange={setAcres}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 acre</span>
                  <span>19 acres</span>
                </div>
              </div>
              <div>
                <Label htmlFor="gunthas" className="text-base font-medium mb-2 block">
                  Additional Gunthas
                </Label>
                <Input
                  id="gunthas"
                  type="number"
                  min="0"
                  max="39"
                  value={gunthas}
                  onChange={(e) => setGunthas(Number(e.target.value))}
                  className="text-base h-12"
                  placeholder="0-39 gunthas"
                />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                Total Area: {(acres[0] + (gunthas / 40)).toFixed(2)} acres 
                ({(acres[0] * 40 + gunthas).toFixed(0)} gunthas)
              </p>
            </div>
          </div>

          {/* Calculation Type */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Calculation Type</h3>
            <Select value={calculationType} onValueChange={setCalculationType}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select calculation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Rental</SelectItem>
                <SelectItem value="lease">Lease</SelectItem>
                <SelectItem value="sale">Purchase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Selection */}
          {calculationType === 'rent' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Rental Price Range</h3>
              <div>
                <Label htmlFor="rentPrice" className="text-base font-medium mb-3 block">
                  Price per acre per year: ₹{rentPrice[0].toLocaleString('en-IN')}
                </Label>
                <Slider
                  id="rentPrice"
                  min={pricing.rent.min}
                  max={pricing.rent.max}
                  step={2500}
                  value={rentPrice}
                  onValueChange={setRentPrice}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>
            </div>
          )}

          {calculationType === 'lease' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Lease Price Range</h3>
              <div>
                <Label htmlFor="leasePrice" className="text-base font-medium mb-3 block">
                  Price per acre (3-year base): ₹{(leasePrice[0] / 100000).toFixed(1)} Lakhs
                </Label>
                <Slider
                  id="leasePrice"
                  min={pricing.lease.min}
                  max={pricing.lease.max}
                  step={50000}
                  value={leasePrice}
                  onValueChange={setLeasePrice}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>₹5 Lakhs</span>
                  <span>₹10 Lakhs</span>
                </div>
              </div>
            </div>
          )}

          {calculationType === 'sale' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Sale Price Range</h3>
              <div>
                <Label htmlFor="salePrice" className="text-base font-medium mb-3 block">
                  Price per guntha: ₹{(salePrice[0] / 100000).toFixed(2)} Lakhs
                </Label>
                <Slider
                  id="salePrice"
                  min={pricing.sale.min}
                  max={pricing.sale.max}
                  step={10000}
                  value={salePrice}
                  onValueChange={setSalePrice}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>₹1.5 Lakhs</span>
                  <span>₹2.5 Lakhs</span>
                </div>
              </div>
            </div>
          )}

          {/* Duration Selection for Rent/Lease */}
          {calculationType === 'rent' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Rental Duration</h3>
              <div>
                <Label htmlFor="rentDuration" className="text-base font-medium mb-2 block">
                  Years: {rentDuration}
                </Label>
                <Slider
                  id="rentDuration"
                  min={1}
                  max={10}
                  step={1}
                  value={[rentDuration]}
                  onValueChange={(value) => setRentDuration(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>10 years</span>
                </div>
              </div>
            </div>
          )}

          {calculationType === 'lease' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Lease Duration</h3>
              <div>
                <Label htmlFor="leaseDuration" className="text-base font-medium mb-2 block">
                  Years: {leaseDuration}
                </Label>
                <Slider
                  id="leaseDuration"
                  min={3}
                  max={20}
                  step={1}
                  value={[leaseDuration]}
                  onValueChange={(value) => setLeaseDuration(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>3 years</span>
                  <span>20 years</span>
                </div>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <div className="text-center">
            <Button 
              onClick={calculatePrice}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Price
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <IndianRupee className="h-6 w-6 mr-2 text-green-600" />
                Calculation Results
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">{result.description}</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(result.totalCost)}
                  </p>
                </div>
                
                {result.monthlyPayment && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                  </div>
                )}
                
                {result.advancePayment && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600 mb-1">Security Deposit/Advance</p>
                    <p className="text-xl font-semibold text-amber-600">
                      {formatCurrency(result.advancePayment)}
                    </p>
                  </div>
                )}

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> These are estimated calculations based on current market rates. 
                    Actual prices may vary based on specific plot location, soil quality, and other factors. 
                    Please contact the owners for precise quotations.
                  </p>
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
