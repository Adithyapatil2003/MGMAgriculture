import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Droplets, TreePine, Wheat, Palmtree, IndianRupee, Download, Send, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const pricingSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  // New images with priority order
  const propertyImages = [
    "/lovable-uploads/ece37575-ccee-478c-8cba-8db9e133eda4.png",
    "/lovable-uploads/bf1f0143-e143-40d0-a44e-a4a62c2dd600.png",
    "/lovable-uploads/0b09419d-486e-498b-8051-e600b4a1f8db.png",
    "/lovable-uploads/bf6693e2-e238-4fae-886b-74a3e6125ecd.png",
    "/lovable-uploads/5c598329-e359-4cec-a690-5aca03c3d116.png",
    "/lovable-uploads/1561e55f-e833-40cd-8e50-22bd67ddac90.png",
    "/lovable-uploads/ea0be2bd-f74d-4e29-820a-9d7ba784c03a.png",
    "/lovable-uploads/6df4ace9-c7b4-479a-ae0a-3163caa589b0.png",
    "/lovable-uploads/263818a0-abf1-4142-9702-bd6283783b37.png",
    "/lovable-uploads/3231cf4b-e544-4c17-a7c0-c7fe0d9975ae.png",
    // Existing images after new ones
    "/lovable-uploads/383bd408-e4a2-4387-84ad-2f48464d4a60.png",
    "/lovable-uploads/7cc8736c-7a77-4093-8aeb-18b5536cb9e5.png",
    "/lovable-uploads/7af551e0-637a-41cb-a322-992c62c0c03d.png",
    "/lovable-uploads/e0ab70b9-5b12-48d5-b737-1656075cbf3b.png",
    "/lovable-uploads/1b67c9a8-c6fe-4902-b3ba-8fa4075e48e0.png",
    "/lovable-uploads/fd7cae1c-a932-46ca-8a69-0b84676cb7de.png",
    "/lovable-uploads/96fd422a-dcb9-4dc7-921e-8b90418ae545.png",
    "/lovable-uploads/b6686886-a8bc-437b-a614-d719dda7b250.png",
    "/lovable-uploads/661f9528-c3c5-4d1d-8bd6-226cd8f6317f.png",
    "/lovable-uploads/a5acc6da-2dc4-4dd7-b53e-94cbabddc9dc.png",
    "/lovable-uploads/3a6dc2d7-3e73-41af-a601-b868e037d728.png",
    "/lovable-uploads/1ed3ce05-3e41-4a5f-b230-fd53d6e59394.png",
    "/lovable-uploads/4bd4ac96-1c1f-4b28-a8a7-d11b534b285c.png",
    "/lovable-uploads/8b06a3dc-e1cd-4fee-ad49-bb27f8bce500.png",
    "/lovable-uploads/76cc52fd-448a-406a-9baa-978084443292.png",
    "/lovable-uploads/d4074998-23e4-43a0-bf9b-6092cfe2ab93.png",
    "/lovable-uploads/ec258172-1a94-4364-b12b-96c84dd82762.png"
  ];

  const plotDetails = [
    { plot: "Plot 1", area: "6 acres 12 Gunthas", type: "Coconut Farm", description: "Large coconut plantation with mature trees" },
    { plot: "Plot 2", area: "1 acre 26 Gunthas", type: "Paddy Field", description: "Fertile paddy cultivation area" },
    { plot: "Plot 3", area: "1 acre 3 Gunthas", type: "Coconut Farm", description: "Compact coconut grove" },
    { plot: "Plot 4", area: "4 acres", type: "Coconut Farm", description: "Extensive coconut plantation" },
    { plot: "Plot 5", area: "2 acres 10 Gunthas", type: "Coconut Farm", description: "Medium-sized coconut farm" },
    { plot: "Plot 6", area: "2 acres 2.5 Gunthas", type: "Teak Plantation", description: "Premium teak tree plantation" },
    { plot: "Plot 7", area: "2 acres", type: "Coconut Farm", description: "Well-maintained coconut grove" }
  ];

  const features = [
    {
      icon: <Palmtree className="h-6 w-6 text-green-600" />,
      title: "Premium Coconuts",
      description: "Tall, oil-rich coconut trees producing nutrient-rich tender coconuts"
    },
    {
      icon: <TreePine className="h-6 w-6 text-amber-600" />,
      title: "Teak Plantation",
      description: "Valuable teak trees for premium timber production"
    },
    {
      icon: <Wheat className="h-6 w-6 text-green-700" />,
      title: "Paddy Fields",
      description: "Fertile paddy cultivation area for rice production"
    },
    {
      icon: <Droplets className="h-6 w-6 text-blue-600" />,
      title: "Water Access",
      description: "Natural water source with irrigation capabilities"
    }
  ];

  const specifications = [
    { label: "Total Area", value: "19 Acres (7 Plots)" },
    { label: "Coconut Farms", value: "5 Plots (15+ Acres)" },
    { label: "Paddy Field", value: "1 Plot (1.65 Acres)" },
    { label: "Teak Plantation", value: "1 Plot (2+ Acres)" },
    { label: "Coconut Quality", value: "Oil-rich, Tender" },
    { label: "Tree Height", value: "Tall, Mature Trees" }
  ];

  const pricingOptions = [
    {
      type: "Rent",
      price: "₹25,000-50,000",
      period: "per acre/year",
      advance: "₹1 lakh advance/security deposit",
      description: "Annual rental with 1-year advance payment"
    },
    {
      type: "Lease",
      price: "₹10 lakhs",
      period: "per acre for 5 years",
      advance: "Long-term commitment",
      description: "5-year lease agreement with full payment"
    },
    {
      type: "Sale",
      price: "₹1.5-2.5 lakhs",
      period: "per guntha",
      advance: "Full ownership",
      description: "Complete ownership with clear title"
    }
  ];

  const owners = [
    { 
      name: "Mohan M G", 
      phones: ["9448018544", "8073984709"], 
      email: "mg_mohan2003@yahoo.co.in",
      whatsapp: "9448018544"
    },
    { 
      name: "Nandini H J", 
      phones: ["9480708440"], 
      email: "nandinimhj@gmail.com",
      whatsapp: "9480708440"
    },
    { 
      name: "M Deepak", 
      phones: ["9845326568"], 
      email: "mm.deepak2003@gmail.com",
      whatsapp: "9845326568"
    }
  ];

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadAllImages = async () => {
    for (let i = 0; i < propertyImages.length; i++) {
      await downloadImage(propertyImages[i], `property-image-${i + 1}.png`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const scrollToPricing = () => {
    pricingSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerContact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create email for owners with email addresses
    const emailSubject = encodeURIComponent("Property Inquiry - MGM Agricultural Land");
    const emailBody = encodeURIComponent(`
Dear Sir/Madam,

I am interested in your MGM Premium Agricultural Lands property and would like to get more information.

Customer Details:
Name: ${customerName}
Contact Number: ${customerContact}
Message: ${customerMessage || 'No additional message'}

Property: 19 acres across 7 plots featuring coconut farms, paddy fields, and teak plantation
Location: MUGTIHALLY & KAIDALA Villages, Nonavinakere, Tiptur Taluk, Tumkur District, Karnataka

Please contact me at your earliest convenience.

Thank you.
    `);

    const ownersWithEmail = owners.filter(owner => owner.email);
    
    // Send to email if available
    if (ownersWithEmail.length > 0) {
      const mailtoLink = `mailto:${ownersWithEmail[0].email}?subject=${emailSubject}&body=${emailBody}`;
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent via email to the property owners.",
      });
    } else {
      toast({
        title: "Error",
        description: "No owner email available. Please contact them directly via phone.",
        variant: "destructive",
      });
    }
    
    // Reset form
    setCustomerName("");
    setCustomerContact("");
    setCustomerMessage("");
  };

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % propertyImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [propertyImages.length]);

  useEffect(() => {
    const disableCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    const disableRightClick = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("copy", disableCopy);
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${propertyImages[selectedImage]})`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button onClick={scrollToPricing}>
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm cursor-pointer transition-all duration-300 hover:scale-105">
                FOR SALE
              </Badge>
            </button>
            <button onClick={scrollToPricing}>
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm cursor-pointer transition-all duration-300 hover:scale-105">
                FOR LEASE
              </Badge>
            </button>
            <button onClick={scrollToPricing}>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm cursor-pointer transition-all duration-300 hover:scale-105">
                FOR RENT
              </Badge>
            </button>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            MGM Premium
            <span className="block text-green-400">Agricultural Lands</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-200 leading-relaxed">
            19 acres across 7 plots featuring coconut farms, paddy fields, and teak plantation
          </p>
          <p className="text-lg mb-8 text-green-200 leading-relaxed">
            MUGTIHALLY & KAIDALA Villages, Nonavinakere, Tiptur Taluk, Tumkur District, Karnataka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToContact}
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Owners
            </Button>
            <Button 
              onClick={scrollToPricing}
              variant="outline" 
              size="lg"
              className="border-white text-white bg-white/20 px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
            >
              View Pricing
            </Button>
          </div>
        </div>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {propertyImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                selectedImage === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Inquiry Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Property <span className="text-blue-200">Inquiry</span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-4">
              Interested in this property? Send us your details and we'll get back to you.
            </p>
            <div className="flex items-center justify-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>Phone</span>
              </div>
            </div>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="customerName" className="text-white text-base font-semibold mb-2 block">
                      Customer Name *
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-white/20 border-white/40 text-white placeholder:text-white/70"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerContact" className="text-white text-base font-semibold mb-2 block">
                      Contact Number *
                    </Label>
                    <Input
                      id="customerContact"
                      type="tel"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      className="bg-white/20 border-white/40 text-white placeholder:text-white/70"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerMessage" className="text-white text-base font-semibold mb-2 block">
                    Message (Optional)
                  </Label>
                  <Textarea
                    id="customerMessage"
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    className="bg-white/20 border-white/40 text-white placeholder:text-white/70 min-h-[100px]"
                    placeholder="Any specific questions or requirements..."
                  />
                </div>
                <div className="text-center">
                  <Button 
                    type="submit"
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Inquiry via Email
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingSectionRef} className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Pricing <span className="text-green-600">Options</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Flexible pricing options to suit your investment needs - rent, lease, or purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="pb-4 text-center">
                  <Badge className={`mx-auto mb-4 ${
                    option.type === 'Rent' ? 'bg-blue-100 text-blue-800' :
                    option.type === 'Lease' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {option.type}
                  </Badge>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 mr-2 text-green-600" />
                    {option.price}
                  </CardTitle>
                  <div className="text-lg text-gray-600">{option.period}</div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-800">{option.advance}</div>
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    {option.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plot Details Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Land <span className="text-green-600">Distribution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our 19-acre property is strategically divided into 7 distinct plots, each optimized for different agricultural purposes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plotDetails.map((plot, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-bold text-gray-800">{plot.plot}</CardTitle>
                    <Badge className={`${
                      plot.type === 'Coconut Farm' ? 'bg-green-100 text-green-800' :
                      plot.type === 'Paddy Field' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {plot.type}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">{plot.area}</div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {plot.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Property <span className="text-green-600">Gallery</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore detailed images of this exceptional multi-plot agricultural property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={downloadAllImages}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="mr-2 h-5 w-5" />
                Download All Images
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Property Images Gallery */}
            <div className="space-y-4">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
                <img 
                  src={propertyImages[selectedImage]} 
                  alt="Property view"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <button
                  onClick={() => downloadImage(propertyImages[selectedImage], `property-image-${selectedImage + 1}.png`)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {propertyImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
                      selectedImage === index ? 'ring-4 ring-green-500 scale-105' : 'hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {propertyImages.length > 4 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {propertyImages.slice(4, 7).map((image, index) => (
                    <button
                      key={index + 4}
                      onClick={() => setSelectedImage(index + 4)}
                      className={`relative h-20 rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
                        selectedImage === index + 4 ? 'ring-4 ring-green-500 scale-105' : 'hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Property view ${index + 5}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Specifications */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Land Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="text-sm text-gray-500 uppercase tracking-wider">{spec.label}</div>
                      <div className="text-lg font-semibold text-gray-800">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-2xl text-white shadow-xl">
                <h4 className="text-2xl font-bold mb-4">Coconut Farm Highlights</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Palmtree className="h-5 w-5 mr-3 text-green-200" />
                    Tall, mature coconut trees with high yield
                  </li>
                  <li className="flex items-center">
                    <Droplets className="h-5 w-5 mr-3 text-blue-200" />
                    Oil-rich coconuts with nutrient-rich tender water
                  </li>
                  <li className="flex items-center">
                    <TreePine className="h-5 w-5 mr-3 text-green-200" />
                    Premium teak plantation for timber value
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Key <span className="text-green-600">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diverse agricultural opportunities across multiple crop types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-b from-white to-gray-50">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 shadow-md">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactSectionRef} className="py-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact <span className="text-green-200">Our Owners</span>
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Reach out to our property owners for detailed information, site visits, and pricing negotiations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {owners.map((owner, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{owner.name}</h3>
                  <div className="space-y-2">
                    {owner.phones.map((phone, phoneIndex) => (
                      <a
                        key={phoneIndex}
                        href={`tel:${phone}`}
                        className="block"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full bg-white/20 border-white/40 text-white hover:bg-white hover:text-green-800 font-semibold"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          {phone}
                        </Button>
                      </a>
                    ))}
                    {owner.whatsapp && (
                      <a
                        href={`https://wa.me/91${owner.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full bg-green-500/20 border-green-400/40 text-white hover:bg-green-400 hover:text-green-900 font-semibold"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Button>
                      </a>
                    )}
                    {owner.email && (
                      <a
                        href={`mailto:${owner.email}`}
                        className="block"
                      >
                        <Button 
                          variant="outline" 
                          className="w-full bg-white/20 border-white/40 text-white hover:bg-white hover:text-green-800 font-semibold text-sm"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          {owner.email}
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <h3 className="text-2xl font-bold mb-4">Property Location</h3>
                <p className="text-green-100 mb-2 text-lg">MUGTIHALLY & KAIDALA Villages</p>
                <p className="text-green-100 mb-4">Nonavinakere, Tiptur Taluk, Tumkur District</p>
                <p className="text-green-100 mb-6">Karnataka 572212</p>
                <a
                  href="https://maps.app.goo.gl/NvcvAGALGAFHiYgA7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-green-800 hover:bg-green-50 font-semibold px-6 py-2 rounded-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4">MGM Premium Agricultural Lands</h3>
            <p className="text-gray-400 text-lg">19 Acres • Available for Sale, Lease & Rent</p>
            <p className="text-gray-400">Karnataka • Tumkur District • Tiptur Taluk</p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">© {new Date().getFullYear()} Agricultural Lands Sales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
