
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InquiryForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerContact || !customerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your inquiry has been submitted successfully. We'll contact you soon!",
      });

      // Reset form
      setCustomerName("");
      setCustomerEmail("");
      setCustomerContact("");
      setCustomerMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Property <span className="text-blue-200">Inquiry</span>
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Interested in this property? Send us your details and we'll get back to you.
          </p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="customerName" className="text-white text-base font-semibold mb-2 block">
                    Full Name *
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
                <Label htmlFor="customerEmail" className="text-white text-base font-semibold mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="bg-white/20 border-white/40 text-white placeholder:text-white/70"
                  placeholder="Enter your email address"
                  required
                />
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
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InquiryForm;
