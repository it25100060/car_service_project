import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Edit2, Trash2, Eye, EyeOff, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';

interface ServiceData {
  id: string;
  description: string;
  cost: number;
  bookingId: string;
  vehicleId?: string;
  bookingDate?: string;
}

interface VehicleData {
  id: string;
  name: string;
  make?: string;
  model?: string;
  year?: string;
}

interface SavedCard {
  id: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  isDefault: boolean;
}

const TAX_PERCENTAGE = 8;

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [service, setService] = useState<ServiceData | null>(null);
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [editedCost, setEditedCost] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card management
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [showCardNumber, setShowCardNumber] = useState(false);
  
  const [newCard, setNewCard] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [editCardDetails, setEditCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const serviceData = location.state?.service as ServiceData;
    if (serviceData) {
      setService(serviceData);
      setEditedCost(serviceData.cost);
      fetchVehicleDetails(serviceData.vehicleId);
    } else {
      toast.error('No service selected');
      navigate('/dashboard');
    }

    // Load saved cards
    loadSavedCards();
  }, []);

  const loadSavedCards = async () => {
    try {
      // Try to fetch cards from backend database first
      const backendCards = await apiRequest('/payments/get-cards');
      if (backendCards && Array.isArray(backendCards) && backendCards.length > 0) {
        // Convert backend format to frontend format
        const formattedCards = backendCards.map((card: any) => ({
          id: card.id,
          cardName: card.cardName,
          cardNumber: card.cardNumber,
          expiry: card.expiry,
          isDefault: false,
        }));
        setSavedCards(formattedCards);
        localStorage.setItem('savedCards', JSON.stringify(formattedCards));
        setSelectedCardId(formattedCards[0]?.id);
        return;
      }
    } catch (error) {
      console.warn('Failed to fetch cards from backend, falling back to localStorage:', error);
    }
    
    // Fall back to localStorage if backend fetch fails
    try {
      const cardsData = localStorage.getItem('savedCards');
      if (cardsData) {
        const cards = JSON.parse(cardsData);
        setSavedCards(cards);
        const defaultCard = cards.find((c: SavedCard) => c.isDefault);
        setSelectedCardId(defaultCard?.id || cards[0]?.id);
      }
    } catch (error) {
      console.error('Error loading saved cards from localStorage:', error);
    }
  };

  const fetchVehicleDetails = async (vehicleId?: string) => {
    if (!vehicleId) return;
    try {
      const vehicleData = await apiRequest(`/vehicles/${vehicleId}`);
      setVehicle(vehicleData);
    } catch (error) {
      console.error('Failed to fetch vehicle:', error);
    }
  };

  const calculateTax = (amount: number) => {
    return Number((amount * (TAX_PERCENTAGE / 100)).toFixed(2));
  };

  const calculateTotal = (amount: number) => {
    return Number((amount + calculateTax(amount)).toFixed(2));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const maskCardNumber = (cardNumber: string) => {
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check all fields are filled
    if (!newCard.cardName.trim()) {
      toast.error('Card name is required');
      return;
    }
    if (!newCard.cardNumber || newCard.cardNumber.trim() === '') {
      toast.error('Card number is required');
      return;
    }
    if (!newCard.expiry || newCard.expiry.trim() === '') {
      toast.error('Expiry date is required');
      return;
    }
    if (!newCard.cvv || newCard.cvv.trim() === '') {
      toast.error('CVV is required');
      return;
    }

    // Validation: Card number must be numeric and correct length
    const cardNum = newCard.cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cardNum)) {
      toast.error('Card number must contain only digits');
      return;
    }
    if (cardNum.length < 13 || cardNum.length > 19) {
      toast.error(`Card number must be 13-19 digits (you entered ${cardNum.length})`);
      return;
    }

    // Validation: CVV must be numeric and 3-4 digits
    const cvvOnly = newCard.cvv.replace(/\D/g, '');
    if (!/^\d{3,4}$/.test(cvvOnly)) {
      toast.error('CVV must be 3-4 numeric digits');
      return;
    }

    // Validation: Expiry format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(newCard.expiry)) {
      toast.error('Expiry date must be in MM/YY format');
      return;
    }

    // Validation: Check expiry month is valid (01-12)
    const [monthStr, yearStr] = newCard.expiry.split('/');
    const monthNum = parseInt(monthStr);
    if (monthNum < 1 || monthNum > 12) {
      toast.error('Expiry month must be between 01 and 12');
      return;
    }

    // Validation: Check expiry date is not expired
    const expiryYear = parseInt('20' + yearStr);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear || (expiryYear === currentYear && monthNum < currentMonth)) {
      toast.error('Card has expired');
      return;
    }

    try {
      // Save card to backend database
      const saveResponse = await apiRequest('/payments/save-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: newCard.cardName.trim(),
          cardNumber: cardNum,
          expiry: newCard.expiry,
          cvv: cvvOnly,
          userId: user?.id || 'unknown',
        }),
      });

      if (saveResponse && (saveResponse.cardId || saveResponse.message)) {
        const card: SavedCard = {
          id: saveResponse.cardId || Date.now().toString(),
          cardName: newCard.cardName,
          cardNumber: newCard.cardNumber,
          expiry: newCard.expiry,
          isDefault: savedCards.length === 0,
        };

        const updatedCards = [...savedCards, card];
        setSavedCards(updatedCards);
        localStorage.setItem('savedCards', JSON.stringify(updatedCards));
        setSelectedCardId(card.id);

        toast.success('Card added and saved successfully');
        setNewCard({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
        setIsAddCardOpen(false);
      }
    } catch (error: any) {
      console.error('Error saving card:', error);
      toast.error(error.message || 'Failed to add card. Please check details and try again.');
    }
  };

  const handleEditCard = (card: SavedCard) => {
    setEditingCardId(card.id);
    setEditCardDetails({
      cardName: card.cardName,
      cardNumber: card.cardNumber,
      expiry: card.expiry,
      cvv: '',
    });
    setIsEditCardOpen(true);
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check all fields are filled
    if (!editCardDetails.cardName.trim()) {
      toast.error('Card name is required');
      return;
    }
    if (!editCardDetails.cardNumber || editCardDetails.cardNumber.trim() === '') {
      toast.error('Card number is required');
      return;
    }
    if (!editCardDetails.expiry || editCardDetails.expiry.trim() === '') {
      toast.error('Expiry date is required');
      return;
    }

    // Validation: Card number must be numeric and correct length
    const cardNum = editCardDetails.cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cardNum)) {
      toast.error('Card number must contain only digits');
      return;
    }
    if (cardNum.length < 13 || cardNum.length > 19) {
      toast.error(`Card number must be 13-19 digits (you entered ${cardNum.length})`);
      return;
    }

    // Validation: Expiry format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(editCardDetails.expiry)) {
      toast.error('Expiry date must be in MM/YY format');
      return;
    }

    // Validation: Check expiry month is valid (01-12)
    const [monthStr, yearStr] = editCardDetails.expiry.split('/');
    const monthNum = parseInt(monthStr);
    if (monthNum < 1 || monthNum > 12) {
      toast.error('Expiry month must be between 01 and 12');
      return;
    }

    // Validation: Check expiry date is not expired
    const expiryYear = parseInt('20' + yearStr);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear || (expiryYear === currentYear && monthNum < currentMonth)) {
      toast.error('Card has expired');
      return;
    }

    try {
      // Save updated card to backend database
      const updateResponse = await apiRequest('/payments/update-card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCardId,
          cardName: editCardDetails.cardName.trim(),
          cardNumber: cardNum,
          expiry: editCardDetails.expiry,
          cvv: editCardDetails.cvv,
          userId: user?.id || 'unknown',
        }),
      });

      if (!updateResponse || !updateResponse.cardId) {
        toast.error(updateResponse?.message || 'Failed to update card');
        return;
      }

      toast.success('Card updated successfully');
      setIsEditCardOpen(false);
      setEditingCardId(null);
      
      // Reload all cards from backend to ensure sync
      await loadSavedCards();
    } catch (error: any) {
      console.error('Error updating card:', error);
      toast.error(error.message || 'Failed to update card. Please try again.');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      // Delete from backend database first
      const deleteResponse = await apiRequest(`/payments/delete-card/${cardId}`, {
        method: 'DELETE',
      });

      if (!deleteResponse) {
        toast.error('Failed to delete card');
        return;
      }

      toast.success('Card deleted successfully');

      // Reload all cards from backend to ensure sync
      await loadSavedCards();
    } catch (error: any) {
      console.error('Error deleting card:', error);
      toast.error(error.message || 'Failed to delete card. Please try again.');
    }
  };

  const selectedCard = savedCards.find((c) => c.id === selectedCardId);

  const handlePayment = async () => {
    if (!service || !selectedCard) {
      toast.error('Please select a card');
      return;
    }

    try {
      setIsProcessing(true);

      const paymentData = {
        serviceId: service.id,
        amount: calculateTotal(editedCost),
        method: 'DEBIT_CARD',
        cardDetails: {
          cardNumber: selectedCard.cardNumber.replace(/\s/g, ''),
          cardName: selectedCard.cardName,
          expiry: selectedCard.expiry,
          cvv: '',
        },
      };

      const response = await apiRequest('/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (response && response.id) {
        // Save payment to localStorage
        const payment = {
          id: response.id || Date.now().toString(),
          serviceName: service.description,
          amount: calculateTotal(editedCost),
          date: new Date().toISOString(),
          status: 'COMPLETED',
          paymentMethod: 'card',
          cardLast4: selectedCard.cardNumber.slice(-4),
        };

        const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        existingPayments.push(payment);
        localStorage.setItem('payments', JSON.stringify(existingPayments));

        // Save payment to backend database
        try {
          const cardLast4 = selectedCard.cardNumber.replace(/\s/g, '').slice(-4);
          const paymentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          const userId = user?.id || 'unknown';
          
          await apiRequest('/payments/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.id,
              amount: calculateTotal(editedCost),
              date: paymentDate,
              cardLast4,
              serviceId: service.id,
              userId,
              bookingId: service.bookingId,
            }),
          });
        } catch (dbError) {
          console.warn('Failed to save payment to database, but payment processed:', dbError);
        }

        // Reset form and order summary
        setEditedCost(0);
        setSelectedCardId(null);
        setShowCardNumber(false);

        toast.success(`Payment of $${calculateTotal(editedCost).toFixed(2)} processed successfully!`);

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!service) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const taxAmount = calculateTax(editedCost);
  const totalAmount = calculateTotal(editedCost);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Service</Label>
                  <p className="text-lg font-medium mt-1">{service.description}</p>
                </div>

                {vehicle && (
                  <div>
                    <Label className="text-sm text-gray-600">Vehicle</Label>
                    <p className="text-lg font-medium mt-1">{vehicle.name}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm text-gray-600">Cost</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={editedCost}
                      onChange={(e) => setEditedCost(Number(e.target.value))}
                      className="w-32"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-sm text-gray-600">
                      (Editable for adjustments)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Select Payment Card</span>
                  <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                    <button
                      onClick={() => setIsAddCardOpen(true)}
                      className="p-2 hover:bg-gray-100 rounded"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Card</DialogTitle>
                        <DialogDescription>Create and save a new debit card</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddCard} className="space-y-4">
                        <div>
                          <Label htmlFor="cardName" className="text-sm">
                            Card Name
                          </Label>
                          <Input
                            id="cardName"
                            placeholder="e.g., My Debit Card"
                            value={newCard.cardName}
                            onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber" className="text-sm">
                            Card Number
                          </Label>
                          <Input
                            id="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={newCard.cardNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9\s]/g, '');
                              setNewCard({ ...newCard, cardNumber: formatCardNumber(val) });
                            }}
                            onInput={(e) => {
                              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s]/g, '');
                            }}
                            maxLength={19}
                            className="mt-1 font-mono"
                            inputMode="numeric"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="text-sm">
                              Expiry Date
                            </Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={newCard.expiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/[^0-9\/]/g, '');
                                if (val.length === 2 && !newCard.expiry.includes('/')) {
                                  val = val + '/';
                                }
                                setNewCard({ ...newCard, expiry: val.substring(0, 5) });
                              }}
                              maxLength={5}
                              className="mt-1 font-mono"
                              inputMode="numeric"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-sm">
                              CVV
                            </Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={newCard.cvv}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setNewCard({ ...newCard, cvv: val.substring(0, 4) });
                              }}
                              onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').substring(0, 4);
                              }}
                              maxLength={4}
                              type="password"
                              className="mt-1 font-mono"
                              inputMode="numeric"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full">
                          Add Card
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedCards.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm mb-4">No saved cards. Create one to proceed.</p>
                    <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                      <button
                        onClick={() => setIsAddCardOpen(true)}
                        className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                        Add Your First Card
                      </button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Card</DialogTitle>
                          <DialogDescription>Create and save a new debit card</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddCard} className="space-y-4">
                          <div>
                            <Label htmlFor="cardName" className="text-sm">
                              Card Name
                            </Label>
                            <Input
                              id="cardName"
                              placeholder="e.g., My Debit Card"
                              value={newCard.cardName}
                              onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="cardNumber" className="text-sm">
                              Card Number
                            </Label>
                            <Input
                              id="cardNumber"
                              placeholder="0000 0000 0000 0000"
                              value={newCard.cardNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9\s]/g, '');
                                setNewCard({ ...newCard, cardNumber: formatCardNumber(val) });
                              }}
                              onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s]/g, '');
                              }}
                              maxLength={19}
                              className="mt-1 font-mono"
                              inputMode="numeric"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry" className="text-sm">
                                Expiry Date
                              </Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={newCard.expiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/[^0-9\/]/g, '');
                                  if (val.length === 2 && !newCard.expiry.includes('/')) {
                                    val = val + '/';
                                  }
                                  setNewCard({ ...newCard, expiry: val.substring(0, 5) });
                                }}
                                maxLength={5}
                                className="mt-1 font-mono"
                                inputMode="numeric"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv" className="text-sm">
                                CVV
                              </Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={newCard.cvv}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setNewCard({ ...newCard, cvv: val.substring(0, 4) });
                                }}
                                onInput={(e) => {
                                  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').substring(0, 4);
                                }}
                                maxLength={4}
                                type="password"
                                className="mt-1 font-mono"
                                inputMode="numeric"
                              />
                            </div>
                          </div>

                          <Button type="submit" className="w-full">
                            Add Card
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <>
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedCardId === card.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{card.cardName}</p>
                              {selectedCardId === card.id && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                              {card.isDefault && (
                                <Badge variant="success" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2 font-mono">
                              {showCardNumber ? card.cardNumber : maskCardNumber(card.cardNumber)}
                            </p>
                            <p className="text-xs text-gray-600">Expires: {card.expiry}</p>
                          </div>

                          {selectedCardId === card.id && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCardNumber(!showCardNumber);
                                }}
                              >
                                {showCardNumber ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCard(card);
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCard(card.id);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Edit Card Modal */}
            <Dialog open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Card Details</DialogTitle>
                  <DialogDescription>Update your card information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateCard} className="space-y-4">
                  <div>
                    <Label htmlFor="editCardName" className="text-sm">
                      Card Name
                    </Label>
                    <Input
                      id="editCardName"
                      placeholder="e.g., My Debit Card"
                      value={editCardDetails.cardName}
                      onChange={(e) => setEditCardDetails({ ...editCardDetails, cardName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="editCardNumber" className="text-sm">
                      Card Number
                    </Label>
                    <Input
                      id="editCardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={editCardDetails.cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9\s]/g, '');
                        setEditCardDetails({ ...editCardDetails, cardNumber: formatCardNumber(val) });
                      }}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9\s]/g, '');
                      }}
                      maxLength={19}
                      className="mt-1 font-mono"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editExpiry" className="text-sm">
                        Expiry Date
                      </Label>
                      <Input
                        id="editExpiry"
                        placeholder="MM/YY"
                        value={editCardDetails.expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9\/]/g, '');
                          if (val.length === 2 && !editCardDetails.expiry.includes('/')) {
                            val = val + '/';
                          }
                          setEditCardDetails({ ...editCardDetails, expiry: val.substring(0, 5) });
                        }}
                        maxLength={5}
                        className="mt-1 font-mono"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCvv" className="text-sm">
                        CVV
                      </Label>
                      <Input
                        id="editCvv"
                        placeholder="123"
                        value={editCardDetails.cvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setEditCardDetails({ ...editCardDetails, cvv: val.substring(0, 4) });
                        }}
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').substring(0, 4);
                        }}
                        maxLength={4}
                        type="password"
                        className="mt-1 font-mono"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Update Card
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditCardOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${editedCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedCard}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${totalAmount.toFixed(2)}`
                  )}
                </Button>

                {!selectedCard && (
                  <p className="text-sm text-red-600 text-center">
                    Please select or create a card to proceed
                  </p>
                )}

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  ✓ Your card details are encrypted and secure
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
