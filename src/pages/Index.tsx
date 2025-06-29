import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Droplets, TreePine, Wheat, Car } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const propertyImages = [
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
  ];

  const features = [
    {
      icon: <Droplets className="h-6 w-6 text-blue-600" />,
      title: "Water Access",
      description: "Natural water source with irrigation capabilities"
    },
    {
      icon: <TreePine className="h-6 w-6 text-green-600" />,
      title: "Rich Soil",
      description: "Fertile agricultural soil perfect for various crops"
    },
    {
      icon: <Wheat className="h-6 w-6 text-amber-600" />,
      title: "Crop Ready",
      description: "Cleared and prepared for immediate cultivation"
    },
    {
      icon: <Car className="h-6 w-6 text-gray-600" />,
      title: "Road Access",
      description: "Easy access via paved roads for transportation"
    }
  ];

  const specifications = [
    { label: "Total Area", value: "19 Acres" },
    { label: "Land Type", value: "Agricultural" },
    { label: "Soil Quality", value: "Grade A Fertile" },
    { label: "Water Source", value: "Available" },
    { label: "Road Access", value: "Paved Road" },
    { label: "Zoning", value: "Agricultural Use" }
  ];

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
            <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm">
              FOR SALE
            </Badge>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
              FOR LEASE
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Premium
            <span className="block text-green-400">Agricultural Land</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            19 acres of pristine farmland with rich soil, water access, and endless possibilities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Owner
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View Details
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

      {/* Property Details Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Property <span className="text-green-600">Overview</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the potential of this exceptional agricultural property, available for both purchase and lease arrangements to suit your farming or investment needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Property Images Gallery */}
            <div className="space-y-4">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={propertyImages[selectedImage]} 
                  alt="Property view"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {propertyImages.map((image, index) => (
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
                <h4 className="text-2xl font-bold mb-4">Prime Location Benefits</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-green-200" />
                    Strategic location with excellent connectivity
                  </li>
                  <li className="flex items-center">
                    <Droplets className="h-5 w-5 mr-3 text-blue-200" />
                    Reliable water supply for year-round cultivation
                  </li>
                  <li className="flex items-center">
                    <TreePine className="h-5 w-5 mr-3 text-green-200" />
                    Established infrastructure for immediate use
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
              Everything you need for successful agricultural operations
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-green-200">Get Started?</span>
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Don't miss this opportunity to own or lease premium agricultural land. Contact us today for viewing arrangements and detailed information.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center gap-2 mb-4">
                  <Badge className="bg-green-500 text-white">Sale</Badge>
                  <Badge className="bg-blue-500 text-white">Lease</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Purchase Options</h3>
                <p className="text-green-100 mb-4">Full ownership or flexible lease terms available</p>
                <Button className="bg-white text-green-800 hover:bg-green-50 font-semibold px-6 py-2 rounded-full">
                  Get Pricing Info
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Phone className="h-10 w-10 mx-auto mb-4 text-green-200" />
                <h3 className="text-xl font-bold mb-2">Direct Contact</h3>
                <p className="text-green-100 mb-4">Speak with the property owner</p>
                <Button className="bg-white text-green-800 hover:bg-green-50 font-semibold px-6 py-2 rounded-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Mail className="h-10 w-10 mx-auto mb-4 text-green-200" />
                <h3 className="text-xl font-bold mb-2">Email Inquiry</h3>
                <p className="text-green-100 mb-4">Get detailed information via email</p>
                <Button className="bg-white text-green-800 hover:bg-green-50 font-semibold px-6 py-2 rounded-full">
                  land@example.com
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <MapPin className="h-10 w-10 mx-auto mb-4 text-green-200" />
                <h3 className="text-xl font-bold mb-2">Property Location</h3>
                <p className="text-green-100 mb-4">Rural Agricultural District</p>
                <Button className="bg-white text-green-800 hover:bg-green-50 font-semibold px-6 py-2 rounded-full">
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4">Premium Agricultural Land</h3>
            <p className="text-gray-400 text-lg">19 Acres • Available for Sale & Lease</p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">© 2024 Agricultural Land Sales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
