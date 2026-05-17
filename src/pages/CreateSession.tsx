import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card, Button, Input, Select, Textarea } from '../components/ui';
import { TRAINING_TYPES, EXPIRY_OPTIONS } from '../data/mock';

interface CustomQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'checkbox';
  required: boolean;
}

export function CreateSession() {
  const navigate = useNavigate();
  const [trainingType, setTrainingType] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [location, setLocation] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [expiryMonths, setExpiryMonths] = useState('12');
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [aiPrompt, setAiPrompt] = useState(
    'Verify that the worker has a valid employer association and that the employer is a known construction company. Flag any enrollments where the employer cannot be verified.'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-fill session name
  const handleTypeChange = (type: string) => {
    setTrainingType(type);
    if (type && scheduledDate && location) {
      const date = new Date(scheduledDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      setSessionName(`${type} - ${date} - ${location}`);
    }
  };

  const handleDateChange = (date: string) => {
    setScheduledDate(date);
    if (trainingType && date && location) {
      const d = new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      setSessionName(`${trainingType} - ${d} - ${location}`);
    }
  };

  const handleLocationChange = (loc: string) => {
    setLocation(loc);
    if (trainingType && scheduledDate && loc) {
      const date = new Date(scheduledDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      setSessionName(`${trainingType} - ${date} - ${loc}`);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: `q-${Date.now()}`,
      question: '',
      type: 'text',
      required: false,
    }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof CustomQuestion, value: string | boolean) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/sessions/ses-001');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div>
        <Header title="Create Session" />
        <main className="p-8 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="text-center max-w-md w-full py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-950 mb-2">Session Created!</h2>
            <p className="text-neutral-500 mb-6">Your QR code is being generated. Redirecting to session details...</p>
            <div className="w-48 h-48 bg-neutral-100 rounded-[--radius-md] mx-auto flex items-center justify-center border-2 border-dashed border-neutral-300">
              <div className="grid grid-cols-5 gap-1 p-4">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 ${Math.random() > 0.4 ? 'bg-neutral-800' : 'bg-white'}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header title="Create Training Session" subtitle="Set up a new training session and generate enrollment QR" />
      <main className="p-8 max-w-4xl">
        <Link to="/sessions" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6">
          <ArrowLeft size={16} /> Back to sessions
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <h3 className="text-base font-semibold text-neutral-950 mb-4">Session Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Training Type"
                options={TRAINING_TYPES.map(t => ({ label: t, value: t }))}
                value={trainingType}
                onChange={e => handleTypeChange(e.target.value)}
                required
              />
              <Input
                label="Scheduled Date"
                type="datetime-local"
                value={scheduledDate}
                onChange={e => handleDateChange(e.target.value)}
                required
              />
              <Input
                label="Location"
                placeholder="e.g., Downtown HQ, Building A"
                value={location}
                onChange={e => handleLocationChange(e.target.value)}
                required
              />
              <Select
                label="Expiry Period"
                options={EXPIRY_OPTIONS.map(e => ({ label: e.label, value: e.value }))}
                value={expiryMonths}
                onChange={e => setExpiryMonths(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <Input
                label="Session Name"
                value={sessionName}
                onChange={e => setSessionName(e.target.value)}
                placeholder="Auto-filled from type + date + location"
                required
              />
              <p className="text-xs text-neutral-400 mt-1">Auto-filled, but you can customize it</p>
            </div>
          </Card>

          {/* Enrollment Questions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-950">Enrollment Questions</h3>
                <p className="text-sm text-neutral-500 mt-0.5">Optional questions workers answer during enrollment</p>
              </div>
              <Button type="button" variant="outline" size="sm" icon={<Plus size={16} />} onClick={addQuestion}>
                Add Question
              </Button>
            </div>
            {questions.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 border border-dashed border-neutral-300">
                <p className="text-sm text-neutral-400">No custom questions yet. Click "Add Question" to add one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <div key={q.id} className="flex items-start gap-3 p-4 bg-neutral-50">
                    <span className="text-sm font-medium text-neutral-400 mt-2 shrink-0 w-6">
                      {i + 1}.
                    </span>
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Enter your question..."
                        value={q.question}
                        onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                      />
                      <div className="flex items-center gap-4">
                        <select
                          value={q.type}
                          onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                          className="px-3 py-1.5 text-sm border border-neutral-300 rounded-[--radius-md] bg-neutral-0"
                        >
                          <option value="text">Text</option>
                          <option value="select">Dropdown</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={e => updateQuestion(q.id, 'required', e.target.checked)}
                            className="border-neutral-300 accent-brand-600"
                          />
                          Required
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Documents */}
          <Card>
            <h3 className="text-base font-semibold text-neutral-950 mb-4">Documents</h3>
            <div className="border-2 border-dashed border-neutral-300 p-8 text-center hover:border-brand-400 hover:bg-brand-50 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-neutral-400 mb-3" />
              <p className="text-sm font-medium text-neutral-600">Drop files here or click to upload</p>
              <p className="text-xs text-neutral-400 mt-1">PDF, DOC, DOCX, images up to 10MB each</p>
            </div>
          </Card>

          {/* AI Quality Standard */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-brand-600" />
              <h3 className="text-base font-semibold text-neutral-950">AI Quality Standard</h3>
            </div>
            <p className="text-sm text-neutral-500 mb-3">
              Define criteria for AI-assisted enrollment review. The AI will score each enrollment against these standards.
            </p>
            <Textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              rows={4}
              placeholder="Describe your quality standards for enrollment review..."
            />
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link to="/sessions">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" icon={<Sparkles size={18} />}>
              Create & Generate QR
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
