import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const ShippingFormPreview = () => {
  const [clientData, setClientData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    province: '',
    zip: '',
    phone: '',
    email: ''
  });

  const clientDataLabels = {
    code: 'Codice Cliente',
    name: 'Nome e Cognome / Ragione Sociale',
    address: 'Indirizzo',
    city: 'Città',
    province: 'Provincia',
    zip: 'CAP',
    phone: 'Telefono',
    email: 'Email'
  };

  const [palletNumber, setPalletNumber] = useState(1);
  const [palletDimensions, setPalletDimensions] = useState([{ width: '', length: '', height: '', weight: '' }]);
  const [merchandiseValue, setMerchandiseValue] = useState('');
  const [calculationResult, setCalculationResult] = useState({
    shipper: '',
    cost: '',
    impact: ''
  });

  const handleClientDataChange = (e) => {
    const { name, value } = e.target;
    let newValue;
    if (name === 'email') {
      newValue = value.toLowerCase();
    } else {
      newValue = value.toUpperCase();
    }
    setClientData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handlePalletNumberChange = (e) => {
    const newPalletNumber = Math.max(1, parseInt(e.target.value) || 1);
    setPalletNumber(newPalletNumber);
    
    setPalletDimensions((prevDimensions) => {
      if (newPalletNumber > prevDimensions.length) {
        return [
          ...prevDimensions,
          ...Array(newPalletNumber - prevDimensions.length).fill({ width: '', length: '', height: '', weight: '' })
        ];
      }
      return prevDimensions.slice(0, newPalletNumber);
    });
  };

  const handleDimensionChange = (index, field, value) => {
    const newValue = Math.max(0, parseFloat(value) || 0);
    setPalletDimensions((prev) => {
      const newDimensions = [...prev];
      newDimensions[index] = { ...newDimensions[index], [field]: newValue.toString() };
      return newDimensions;
    });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const bestShipper = "SpedizionExpress";
    const shippingCost = 150.00;
    const impactPercentage = ((shippingCost / parseFloat(merchandiseValue || 1)) * 100).toFixed(2);
    
    setCalculationResult({
      shipper: bestShipper,
      cost: shippingCost.toFixed(2),
      impact: impactPercentage
    });
  };

  const handlePrintPDF = () => {
    console.log('Stampa Modulo PDF richiesta');
  };

  const handlePrintHistoryPDF = () => {
    console.log('Stampa Storico PDF richiesta');
  };

  return (
    <div className="p-4 bg-gray-100 font-sans">
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow">
        <img src="/api/placeholder/120/120" alt="Logo General Vending" className="w-[120px] h-[120px]" />
        <div className="text-center flex-grow mx-4">
          <h2 className="m-0 text-blue-700 text-5xl font-bold font-sans">GENERAL VENDING</h2>
          <p className="mt-2 text-2xl">Soluzioni per operatori Vending e Retail</p>
        </div>
        <img src="/api/placeholder/120/120" alt="Logo Luxury" className="w-[120px] h-[120px]" />
      </div>

      <div className="flex justify-between space-x-4">
        <div className="w-1/2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-2">Dati del Cliente</h3>
            </CardHeader>
            <CardContent>
              <form className="space-y-3">
                {Object.entries(clientData).map(([key, value]) => (
                  <input
                    key={key}
                    type={key === 'email' ? 'email' : 'text'}
                    name={key}
                    placeholder={clientDataLabels[key]}
                    value={value}
                    onChange={handleClientDataChange}
                    className={`w-full p-2 text-sm border rounded ${key === 'email' ? 'lowercase' : 'uppercase'}`}
                  />
                ))}
                <div className="flex justify-between">
                  <button type="button" className="px-3 py-1 text-sm bg-green-500 text-white rounded">Carica Cliente</button>
                  <button type="button" className="px-3 py-1 text-sm bg-green-500 text-white rounded">Salva Cliente</button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-2">Dettagli della Spedizione</h3>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleCalculate}>
                <div>
                  <label htmlFor="merchandiseValue" className="block text-sm mb-1">Valore della Merce (€):</label>
                  <input 
                    type="number"
                    id="merchandiseValue"
                    value={merchandiseValue}
                    onChange={(e) => setMerchandiseValue(e.target.value)}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="Inserisci il valore della merce"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="palletNumber" className="block text-sm mb-1">Numero di Pallet (1-33):</label>
                  <input 
                    type="number"
                    id="palletNumber"
                    value={palletNumber}
                    onChange={handlePalletNumberChange}
                    className="w-full p-2 text-sm border rounded"
                    min="1"
                    max="33"
                  />
                </div>
                {palletDimensions.map((pallet, index) => (
                  <div key={index} className="p-2 border rounded">
                    <h4 className="text-sm font-bold text-blue-700 mb-2">Pallet {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'width', label: 'Larghezza' },
                        { key: 'length', label: 'Profondità' },
                        { key: 'height', label: 'Altezza' },
                        { key: 'weight', label: 'Peso' }
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label htmlFor={`${key}-${index}`} className="block text-xs mb-1">{label} ({key === 'weight' ? 'kg' : 'cm'}):</label>
                          <input 
                            type="number"
                            id={`${key}-${index}`}
                            value={pallet[key]}
                            onChange={(e) => handleDimensionChange(index, key, e.target.value)}
                            className="w-full p-1 text-sm border rounded"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button 
                  type="submit"
                  className="w-full py-2 bg-blue-700 text-white text-sm rounded"
                >
                  Calcola miglior spedizioniere
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-2">Storico Spedizioni Cliente</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Totale Pallet Spediti:', value: '487' },
                { label: 'Valore totale delle spedizioni effettuate ad oggi:', value: '€157,325.00' },
                { label: 'Incidenza costi di trasporto sul fatturato:', value: '3.75%' }
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm mb-1">{label}</p>
                  <input 
                    type="text" 
                    value={value}
                    readOnly 
                    className="w-full p-2 text-sm border rounded bg-gray-100"
                  />
                </div>
              ))}
              <table className="w-full mt-3 border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Spedizioniere</th>
                    <th className="border p-2 text-right">Costo Totale</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'MT LOGISTIC', cost: '€52,230.00' },
                    { name: 'LA PREALPINA', cost: '€48,705.50' },
                    { name: 'BRT', cost: '€31,207.75' },
                    { name: 'GLS', cost: '€15,681.75' },
                    { name: 'G.I.D.D. Srl', cost: '€9,500.00' }
                  ].map(({ name, cost }) => (
                    <tr key={name}>
                      <td className="border p-2">{name}</td>
                      <td className="border p-2 text-right">{cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button 
                onClick={handlePrintHistoryPDF}
                className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white hover:bg-gray-700"
              >
                <Printer size={18} />
                <span>Stampa Storico PDF</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-blue-700 border-b-2 border-blue-700 pb-2">Risultati</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'shipper', label: 'Spedizioniere più conveniente' },
                  { key: 'cost', label: 'Costo della spedizione (€)' },
                  { key: 'impact', label: 'Incidenza sul valore della merce (%)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <p className="text-sm mb-1">{label}:</p>
                    <input 
                      type="text" 
                      value={calculationResult[key]} 
                      readOnly 
                      className="w-full p-2 text-sm border rounded bg-gray-100"
                    />
                  </div>
                ))}
                <Button 
                  onClick={handlePrintPDF}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-700 text-white hover:bg-blue-600"
                >
                  <Printer size={18} />
                  <span>Stampa Modulo PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingFormPreview;
