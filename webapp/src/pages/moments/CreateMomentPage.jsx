import { InstantDialog, MomentTypePicker } from '../../../../src/shared/InstantExperience';
import React from 'react';
import { ArrowLeft, Image as ImageIcon, User } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAppState } from '../../context/AppStateContext';
import { Modal, Button } from '../../components/ui';
import { useCloseTo } from '../../lib/navigation';

/* Create Moment — the mobile bottom sheet, served as a modal route. */
export default function CreateMomentPage() {
  const { t, isDark } = useTheme();
  const { showToast } = useAppState();
  const close = useCloseTo('/home');
  const [step, setStep] = React.useState('select');
  const [noteText, setNoteText] = React.useState('');

  const handlePost = () => {
    showToast('Moment shared');
    close();
  };

  if (step === 'instant') return <InstantDialog initialScreen="camera" onClose={close} />;

  return (
    <Modal onClose={close} title={step === 'select' ? 'Create Moment' : step === 'compose_note' ? 'Share a Note' : 'Preview'} size="sm">
      {step === 'select' && (
        <div className="flex flex-col pb-2">
          <MomentTypePicker t={t} onNote={() => setStep('compose_note')} onInstant={() => setStep('instant')} />
        </div>
      )}

      {step === 'compose_note' && (
        <div className="flex flex-col pb-2 min-h-[46vh]">
          <button onClick={() => setStep('select')} className={`self-start mb-4 w-8 h-8 rounded-full flex items-center justify-center active:scale-95`} aria-label="Back">
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`relative w-full max-w-[280px] p-6 rounded-3xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} shadow-inner mb-6`}>
              <textarea
                autoFocus
                maxLength={60}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Share a thought..."
                className={`w-full bg-transparent text-center text-xl font-light ${t.text} resize-none focus:outline-none`}
                rows={3}
              />
              <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 ${isDark ? 'bg-[#333333]' : 'bg-gray-100'}`}></div>
            </div>
            <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border-2 flex items-center justify-center shadow-lg relative z-10`}>
              <User className={`w-8 h-8 ${t.textMuted}`} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4">
            <span className={`text-[11px] font-medium ${noteText.length === 60 ? 'text-red-500' : t.textMuted}`}>{noteText.length}/60</span>
            <button
              disabled={!noteText.trim()}
              onClick={handlePost}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95 ${noteText.trim() ? 'bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/40' : `${isDark ? 'bg-gray-700' : 'bg-gray-300'} text-gray-500 cursor-not-allowed`}`}
            >
              Share
            </button>
          </div>
        </div>
      )}

      {step === 'compose_media' && (
        <div className="flex flex-col pb-2 min-h-[52vh]">
          <button onClick={() => setStep('select')} className={`self-start mb-4 w-8 h-8 rounded-full flex items-center justify-center active:scale-95`} aria-label="Back">
            <ArrowLeft className={`w-6 h-6 ${t.text}`} strokeWidth={2.5} />
          </button>
          <div className={`flex-1 rounded-3xl ${isDark ? 'bg-[#121212]' : 'bg-gray-200'} flex items-center justify-center overflow-hidden relative mb-4 min-h-[280px]`}>
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white font-medium text-sm">Tap to change media</span>
            </div>
          </div>
          <Button full onClick={handlePost} className="shadow-lg shadow-[#1D9BF0]/40">Post Moment</Button>
        </div>
      )}
    </Modal>
  );
}
