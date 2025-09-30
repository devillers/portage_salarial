'use client';

import { useState } from 'react';
import ClientIcon from '../ClientIcon';

export default function ChaletBooking({ chalet }) {
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    guest: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: dates, 2: guest info, 3: payment

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('guest.')) {
      const guestField = name.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        guest: {
          ...prev.guest,
          [guestField]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const baseAmount = nights * (chalet.pricing?.basePrice || 0);
    const cleaningFee = chalet.pricing?.cleaningFee || 0;
    const taxes = (baseAmount + cleaningFee) * ((chalet.pricing?.taxRate || 0) / 100);
    return {
      nights,
      baseAmount,
      cleaningFee,
      taxes,
      total: baseAmount + cleaningFee + taxes
    };
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate dates
      if (!bookingData.checkIn || !bookingData.checkOut) {
        setError('Veuillez sélectionner les dates d\'arrivée et de départ');
        return;
      }
      
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      
      if (checkIn >= checkOut) {
        setError('La date de départ doit être après la date d\'arrivée');
        return;
      }
      
      if (checkIn < new Date()) {
        setError('La date d\'arrivée ne peut pas être dans le passé');
        return;
      }
      
      const totalGuests = parseInt(bookingData.adults) + parseInt(bookingData.children);
      if (totalGuests > (chalet.specifications?.maxGuests || 0)) {
        setError(`Ce chalet peut accueillir maximum ${chalet.specifications?.maxGuests} personnes`);
        return;
      }
    }
    
    if (step === 2) {
      // Validate guest info
      if (!bookingData.guest.firstName || !bookingData.guest.lastName || !bookingData.guest.email) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.guest.email)) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const handleBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const pricing = calculateTotal();
      
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chaletId: chalet._id,
          amount: pricing.total,
          currency: chalet.pricing?.currency || 'EUR',
          customerEmail: bookingData.guest.email,
          bookingData: {
            ...bookingData,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: {
              adults: parseInt(bookingData.adults),
              children: parseInt(bookingData.children),
              total: parseInt(bookingData.adults) + parseInt(bookingData.children)
            }
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.sessionUrl;
      } else {
        setError(data.message || 'Erreur lors de la création de la session de paiement');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-900">
            Réservation
          </h3>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber === step
                    ? 'bg-primary-700 text-white'
                    : stepNumber < step
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {stepNumber < step ? (
                  <ClientIcon name="Check" className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ClientIcon name="AlertCircle" className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Dates and Guests */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date d'arrivée
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date de départ
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleInputChange}
                  min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Adultes
                </label>
                <select
                  name="adults"
                  value={bookingData.adults}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {[...Array(chalet.specifications?.maxGuests || 8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} adulte{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Enfants
                </label>
                <select
                  name="children"
                  value={bookingData.children}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {[...Array(Math.max(0, (chalet.specifications?.maxGuests || 8) - parseInt(bookingData.adults)))].map((_, i) => (
                    <option key={i} value={i}>
                      {i} enfant{i > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {pricing.nights > 0 && (
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>€{chalet.pricing?.basePrice || 0} × {pricing.nights} nuit{pricing.nights > 1 ? 's' : ''}</span>
                  <span>€{pricing.baseAmount.toFixed(2)}</span>
                </div>
                {pricing.cleaningFee > 0 && (
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span>Frais de ménage</span>
                    <span>€{pricing.cleaningFee.toFixed(2)}</span>
                  </div>
                )}
                {pricing.taxes > 0 && (
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span>Taxes</span>
                    <span>€{pricing.taxes.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-200 mt-3 pt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>€{pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Guest Information */}
        {step === 2 && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-neutral-900">
              Informations du voyageur principal
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="guest.firstName"
                  value={bookingData.guest.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="guest.lastName"
                  value={bookingData.guest.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="guest.email"
                value={bookingData.guest.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="guest.phone"
                value={bookingData.guest.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
        )}

        {/* Step 3: Payment Summary */}
        {step === 3 && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-neutral-900">
              Récapitulatif de la réservation
            </h4>
            
            <div className="bg-neutral-50 p-6 rounded-lg space-y-4">
              <div>
                <h5 className="font-semibold text-neutral-900 mb-2">Séjour</h5>
                <p className="text-sm text-neutral-600">
                  Du {new Date(bookingData.checkIn).toLocaleDateString('fr-FR')} au {new Date(bookingData.checkOut).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-neutral-600">
                  {pricing.nights} nuit{pricing.nights > 1 ? 's' : ''} • {parseInt(bookingData.adults) + parseInt(bookingData.children)} personne{parseInt(bookingData.adults) + parseInt(bookingData.children) > 1 ? 's' : ''}
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold text-neutral-900 mb-2">Voyageur principal</h5>
                <p className="text-sm text-neutral-600">
                  {bookingData.guest.firstName} {bookingData.guest.lastName}
                </p>
                <p className="text-sm text-neutral-600">
                  {bookingData.guest.email}
                </p>
              </div>
              
              <div className="border-t border-neutral-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hébergement ({pricing.nights} nuit{pricing.nights > 1 ? 's' : ''})</span>
                    <span>€{pricing.baseAmount.toFixed(2)}</span>
                  </div>
                  {pricing.cleaningFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Frais de ménage</span>
                      <span>€{pricing.cleaningFee.toFixed(2)}</span>
                    </div>
                  )}
                  {pricing.taxes > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Taxes</span>
                      <span>€{pricing.taxes.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-neutral-300 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>€{pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
            >
              Retour
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={step === 1 && pricing.nights === 0}
              className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continuer
            </button>
          ) : (
            <button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <ClientIcon name="CreditCard" className="mr-2 h-5 w-5" />
                  Procéder au Paiement
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}