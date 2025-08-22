'use client';

import { useState } from 'react';
import { TaxResults } from './utils/taxCalculator';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-300">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md bg-neutral-800 border border-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
    />
  </div>
);

export default function Page() {
  // Form states
  const [age, setAge] = useState<'below60' | '60to80' | 'above80'>('below60');
  const [grossSalary, setGrossSalary] = useState('');
  const [deduction80c, setDeduction80c] = useState('');
  const [deduction80d, setDeduction80d] = useState('');
  const [npsContribution, setNpsContribution] = useState('');
  const [homeLoanInterest, setHomeLoanInterest] = useState('');
  const [deduction80tta, setDeduction80tta] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [hraReceived, setHraReceived] = useState('');
  const [rentPaid, setRentPaid] = useState('');
  const [livesInMetro, setLivesInMetro] = useState(false);

  const [results, setResults] = useState<TaxResults | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdvice(null);

    const inputs = {
      age,
      grossSalary: Number(grossSalary) || 0,
      deduction80c: Number(deduction80c) || 0,
      deduction80d: Number(deduction80d) || 0,
      npsContribution: Number(npsContribution) || 0,
      homeLoanInterest: Number(homeLoanInterest) || 0,
      deduction80tta: Number(deduction80tta) || 0,
      basicSalary: Number(basicSalary) || 0,
      hraReceived: Number(hraReceived) || 0,
      rentPaid: Number(rentPaid) || 0,
      livesInMetro,
    };

    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setAdvice(data.advice);
      }
    } catch (err) {
      console.error('Error fetching advice', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4 font-light tracking-wide">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-semibold text-white">AI Tax Advisor</h1>
          <p className="text-gray-400 text-sm">
            Enter your details to calculate tax & get personalized AI advice.
          </p>
        </header>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 rounded-2xl shadow-xl p-6 space-y-6 border border-neutral-800"
        >
          {/* Basic Info */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-gray-200">
              Basic Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="age" className="text-sm font-medium text-gray-300">
                  Age Group
                </label>
                <select
                  id="age"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value as 'below60' | '60to80' | 'above80')
                  }
                  className="w-full rounded-md bg-neutral-800 border border-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="below60">Below 60 years</option>
                  <option value="60to80">60 to 80 years (Senior Citizen)</option>
                  <option value="above80">Above 80 years (Super Senior Citizen)</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Income Details */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-gray-200">
              Income Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <InputField
                id="grossSalary"
                label="Gross Annual Salary"
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                placeholder="e.g., 1500000"
              />
              <p className="text-xs text-gray-500">
                Standard Deduction of ₹50,000 is auto-applied.
              </p>
            </div>
          </fieldset>

          {/* Common Deductions */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-gray-200">
              Common Deductions (Old Regime)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField id="deduction80c" label="Section 80C" type="number" value={deduction80c} onChange={(e) => setDeduction80c(e.target.value)} placeholder="e.g., 150000" />
              <InputField id="deduction80d" label="Section 80D - Medical Insurance" type="number" value={deduction80d} onChange={(e) => setDeduction80d(e.target.value)} placeholder="e.g., 20000" />
              <InputField id="npsContribution" label="NPS Contribution 80CCD(1B)" type="number" value={npsContribution} onChange={(e) => setNpsContribution(e.target.value)} placeholder="e.g., 50000" />
              <InputField id="homeLoanInterest" label="Home Loan Interest - Sec 24(b)" type="number" value={homeLoanInterest} onChange={(e) => setHomeLoanInterest(e.target.value)} placeholder="e.g., 200000" />
              <InputField id="deduction80tta" label="Interest from Savings - 80TTA/80TTB" type="number" value={deduction80tta} onChange={(e) => setDeduction80tta(e.target.value)} placeholder="e.g., 5000" />
            </div>
          </fieldset>

          {/* HRA Exemption */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-gray-200">
              House Rent Allowance (HRA)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField id="basicSalary" label="Annual Basic Salary" type="number" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} placeholder="e.g., 600000" />
              <InputField id="hraReceived" label="Total HRA Received" type="number" value={hraReceived} onChange={(e) => setHraReceived(e.target.value)} placeholder="e.g., 200000" />
              <InputField id="rentPaid" label="Total Rent Paid" type="number" value={rentPaid} onChange={(e) => setRentPaid(e.target.value)} placeholder="e.g., 240000" />
              <div className="flex items-center space-x-2">
                <input id="livesInMetro" type="checkbox" checked={livesInMetro} onChange={(e) => setLivesInMetro(e.target.checked)} className="h-4 w-4 rounded bg-neutral-800 border-neutral-700 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="livesInMetro" className="text-sm text-gray-300">
                  I live in a metro city
                </label>
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end">
            <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50">
              {loading ? 'Calculating...' : 'Calculate Tax'}
            </button>
          </div>
        </form>

        {/* Results */}
        {results && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">Results</h2>
            <p>Old Regime Tax: ₹{results.oldRegimeTax.toLocaleString()}</p>
            <p>New Regime Tax: ₹{results.newRegimeTax.toLocaleString()}</p>
            <p>Savings: ₹{results.savings.toLocaleString()}</p>
            <p>
              Recommended Regime:{' '}
              <span className="font-bold text-indigo-400">
                {results.recommendedRegime === 'old' ? 'Old Regime' : 'New Regime'}
              </span>
            </p>
          </div>
        )}

        {/* AI Advice */}
        {advice && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white">AI Advice</h2>
            <p className="text-gray-300 whitespace-pre-line">{advice}</p>
          </div>
        )}
      </div>
    </div>
  );
}
