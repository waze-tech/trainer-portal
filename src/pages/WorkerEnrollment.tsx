import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle2, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { sessions } from '../data/mock';

type Step = 'phone' | 'otp' | 'info' | 'success';

export function WorkerEnrollment() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const session = sessions.find(s => s.id === sessionId);
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employer, setEmployer] = useState('');
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <p className="text-neutral-500">Session not found or no longer active.</p>
        </div>
      </div>
    );
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const isInfoValid = firstName && lastName && employer && consent &&
    session.enrollmentQuestions.filter(q => q.required).every(q => answers[q.id]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Mobile header */}
      <div className="bg-neutral-950 px-4 py-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <img src="/breadcrumb-logo.jpg" alt="Breadcrumb" width={28} height={28} className="object-contain" />
          <span className="font-semibold">Breadcrumb</span>
        </div>
        <h1 className="text-lg font-semibold mt-2">{session.type} Training</h1>
        <p className="text-sm text-white/70">{session.location}</p>
        <p className="text-xs text-white/50 mt-1">
          {new Date(session.scheduledDate).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
          })}
        </p>
      </div>

      {/* Progress */}
      {step !== 'success' && (
        <div className="px-4 py-3 bg-white border-b border-neutral-200">
          <div className="flex items-center gap-2">
            {(['phone', 'otp', 'info'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s ? 'bg-brand-600 text-white' :
                  (['phone', 'otp', 'info'].indexOf(step) > i) ? 'bg-green-600 text-white' :
                  'bg-neutral-200 text-neutral-400'
                }`}>
                  {['phone', 'otp', 'info'].indexOf(step) > i ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 ${['phone', 'otp', 'info'].indexOf(step) > i ? 'bg-green-600' : 'bg-neutral-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {/* Phone Step */}
        {step === 'phone' && (
          <div className="bg-white-2xl shadow-sm p-6 mt-4">
            <h2 className="text-lg font-semibold text-neutral-950 mb-1">Enter your phone number</h2>
            <p className="text-sm text-neutral-500 mb-6">We'll send you a verification code</p>
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 text-base border border-neutral-300 rounded-[--radius-md] bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>
            <button
              onClick={() => setStep('otp')}
              disabled={!phone}
              className="w-full py-3 rounded-[--radius-md] bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              Send Code <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="bg-white-2xl shadow-sm p-6 mt-4">
            <button onClick={() => setStep('phone')} className="text-sm text-neutral-500 flex items-center gap-1 mb-4 cursor-pointer">
              <ArrowLeft size={14} /> Back
            </button>
            <h2 className="text-lg font-semibold text-neutral-950 mb-1">Verify your number</h2>
            <p className="text-sm text-neutral-500 mb-6">Enter the 6-digit code sent to {phone}</p>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  className="w-12 h-14 rounded-[--radius-md] text-center text-xl font-semibold border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              ))}
            </div>
            <button
              onClick={() => setStep('info')}
              className="w-full py-3 rounded-[--radius-md] bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Verify <ArrowRight size={18} />
            </button>
            <p className="text-center text-xs text-neutral-400 mt-4">
              Didn't receive a code? <button className="text-brand-600 font-medium cursor-pointer">Resend</button>
            </p>
          </div>
        )}

        {/* Info Step */}
        {step === 'info' && (
          <div className="bg-white-2xl shadow-sm p-6 mt-4">
            <button onClick={() => setStep('otp')} className="text-sm text-neutral-500 flex items-center gap-1 mb-4 cursor-pointer">
              <ArrowLeft size={14} /> Back
            </button>
            <h2 className="text-lg font-semibold text-neutral-950 mb-1">Your information</h2>
            <p className="text-sm text-neutral-500 mb-6">Fill in your details to enroll in this training session</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-4 py-3 text-base border border-neutral-300 rounded-[--radius-md] bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-4 py-3 text-base border border-neutral-300 rounded-[--radius-md] bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Employer / Company *</label>
                <input
                  type="text"
                  value={employer}
                  onChange={e => setEmployer(e.target.value)}
                  placeholder="Company name"
                  className="w-full px-4 py-3 text-base border border-neutral-300 rounded-[--radius-md] bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>

              {/* Custom enrollment questions */}
              {session.enrollmentQuestions.map(q => (
                <div key={q.id}>
                  <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                    {q.question} {q.required && '*'}
                  </label>
                  {q.type === 'select' && q.options ? (
                    <select
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="w-full px-4 py-3 text-base border border-neutral-300 rounded-[--radius-md] bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 appearance-none"
                    >
                      <option value="">Select...</option>
                      {q.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : q.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={answers[q.id] === 'true'}
                        onChange={e => setAnswers({ ...answers, [q.id]: e.target.checked ? 'true' : '' })}
                        className="border-neutral-300 accent-brand-600"
                      />
                      <span className="text-sm text-neutral-600">Yes</span>
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder="Your answer"
                      className="w-full px-4 py-3 text-base border border-neutral-300 rounded-[--radius-md] bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                    />
                  )}
                </div>
              ))}

              {/* Consent */}
              <div className="bg-neutral-50 p-4 border border-neutral-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 border-neutral-300 accent-brand-600"
                  />
                  <div>
                    <span className="text-sm text-neutral-700">
                      I give permission for this training record to be added to my Breadcrumb wallet once approved by the trainer.
                    </span>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-400">
                      <Shield size={12} />
                      <span>Your data is secure and only shared with authorized trainers</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep('success')}
              disabled={!isInfoValid}
              className="w-full py-3 mt-6 rounded-[--radius-md] bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              Submit Enrollment <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="bg-white rounded-[--radius-xl] shadow-sm p-8 mt-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-950 mb-2">You're enrolled!</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Your enrollment for <strong>{session.type}</strong> training has been submitted.
            </p>
            <div className="bg-neutral-50 p-4 text-left mb-6">
              <p className="text-sm text-neutral-600"><strong>What happens next?</strong></p>
              <ul className="text-sm text-neutral-500 mt-2 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">1.</span>
                  Your trainer will review and approve your enrollment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">2.</span>
                  Attend the training on the scheduled date
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">3.</span>
                  Your training record will be added to your Breadcrumb wallet
                </li>
              </ul>
            </div>
            <div className="bg-brand-50 p-4 border border-brand-200">
              <p className="text-sm text-brand-600 font-medium">Training Details</p>
              <p className="text-sm text-neutral-600 mt-1">{session.name}</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit'
                })}
              </p>
              <p className="text-xs text-neutral-400">{session.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-neutral-400">Powered by <span className="font-medium text-brand-600">Breadcrumb</span></p>
      </div>
    </div>
  );
}
