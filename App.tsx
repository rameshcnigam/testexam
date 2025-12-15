import React, { useState, useCallback } from 'react';
import { CHAPTERS, MOCK_CHAPTER } from './constants';
import { Chapter, Question, SectionType, ViewState } from './types';
import { generateQuiz, generateMockQuiz } from './services/geminiService';
import { BookOpenIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, ChevronRightIcon } from './components/Icons';

function App() {
  // Application State
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Group Chapters by Section
  const sections = {
    [SectionType.COMMON]: CHAPTERS.filter(c => c.section === SectionType.COMMON),
    [SectionType.LIFE]: CHAPTERS.filter(c => c.section === SectionType.LIFE),
    [SectionType.HEALTH]: CHAPTERS.filter(c => c.section === SectionType.HEALTH),
  };

  // --- Handlers ---

  const handleStartChapter = useCallback(async (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setView('LOADING');
    setError(null);
    setUserAnswers({});
    setCurrentQIndex(0);
    setScore(0);

    try {
      // Check if it's the special Mock Test chapter
      let generatedQuestions;
      if (chapter.id === 0) {
        generatedQuestions = await generateMockQuiz();
      } else {
        generatedQuestions = await generateQuiz(chapter);
      }
      setQuestions(generatedQuestions);
      setView('QUIZ');
    } catch (err) {
      setError("प्रश्न बनाने में विफल। कृपया सुनिश्चित करें कि आपकी API कुंजी मान्य है और पुनः प्रयास करें।");
      setView('DASHBOARD');
    }
  }, []);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setView('RESULTS');
  };

  const handleBackToDashboard = () => {
    setView('DASHBOARD');
    setSelectedChapter(null);
    setQuestions([]);
  };

  // --- Views ---

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-brand-900 mb-2 tracking-tight">IC38 मास्टर</h1>
        <p className="text-lg text-slate-600">बीमा एजेंट प्रमाणन परीक्षा की तैयारी</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 inline-block">
            {error}
          </div>
        )}
      </header>

      {/* Mock Test Banner */}
      <div className="mb-12">
        <button 
          onClick={() => handleStartChapter(MOCK_CHAPTER)}
          className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  सुझाव
                </span>
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  परीक्षा मोड
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{MOCK_CHAPTER.title}</h2>
              <p className="text-brand-100 max-w-2xl text-lg">
                {MOCK_CHAPTER.description}
              </p>
            </div>
            <div className="bg-white text-brand-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm group-hover:bg-brand-50 transition-colors whitespace-nowrap">
              अभी शुरू करें <ChevronRightIcon />
            </div>
          </div>
        </button>
      </div>

      <div className="space-y-12">
        {Object.entries(sections).map(([sectionName, chapters]) => (
          <div key={sectionName} className="relative">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-2 h-8 bg-brand-500 rounded-full inline-block"></span>
              {sectionName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => handleStartChapter(chapter)}
                  className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-300 transition-all duration-200 p-6 text-left flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded">
                        अध्याय {chapter.id}
                      </span>
                      <BookOpenIcon />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {chapter.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-brand-600 text-sm font-medium">
                    अभ्यास क्विज़ शुरू करें <ChevronRightIcon />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {selectedChapter?.id === 0 ? 'परीक्षा तैयार हो रही है...' : 'क्विज़ तैयार हो रहा है...'}
      </h2>
      <p className="text-slate-600 text-center max-w-md">
        कृपया प्रतीक्षा करें, हमारा AI <span className="font-semibold text-brand-700">"{selectedChapter?.title}"</span> के लिए प्रश्न तैयार कर रहा है।
        {selectedChapter?.id === 0 && <br/>}
        {selectedChapter?.id === 0 && <span className="text-sm mt-2 block text-slate-500">(इसमें सामान्य से थोड़ा अधिक समय लग सकता है क्योंकि हम पूरे पाठ्यक्रम को कवर कर रहे हैं)</span>}
      </p>
    </div>
  );

  const renderQuiz = () => {
    const currentQ = questions[currentQIndex];
    const isAnswered = userAnswers[currentQ.id] !== undefined;
    const allAnswered = questions.every(q => userAnswers[q.id] !== undefined);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
              onClick={handleBackToDashboard} 
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeftIcon /> बाहर निकलें
            </button>
            <div className="text-center">
               <h2 className="text-sm font-bold text-brand-600 uppercase tracking-wide">
                 {selectedChapter?.id === 0 ? 'मॉक टेस्ट' : `अध्याय ${selectedChapter?.id}`}
               </h2>
               <p className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-md">{selectedChapter?.title}</p>
            </div>
            <div className="text-sm font-mono font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
              {currentQIndex + 1} / {questions.length}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1 mt-4 rounded-full overflow-hidden">
             <div 
               className="bg-brand-500 h-full transition-all duration-300"
               style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 mb-6 flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
              {currentQ.text}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(currentQ.id, idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                    userAnswers[currentQ.id] === idx
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                     userAnswers[currentQ.id] === idx 
                      ? 'bg-brand-500 text-white border-brand-500' 
                      : 'bg-white text-slate-400 border-slate-300 group-hover:border-brand-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                  {userAnswers[currentQ.id] === idx && <CheckCircleIcon className="w-6 h-6 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-auto">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQIndex === 0 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              पिछला
            </button>
            
            {currentQIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-all ${
                  allAnswered 
                    ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                क्विज़ जमा करें
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all hover:shadow-lg flex items-center gap-2"
              >
                अगला <ChevronRightIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100);
    const isPass = percentage >= 35; // Standard generic pass mark

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-center p-10">
            <h2 className="text-slate-500 font-medium uppercase tracking-widest mb-4">
              {selectedChapter?.id === 0 ? 'मॉक टेस्ट परिणाम' : 'क्विज़ परिणाम'}
            </h2>
            <div className="mb-6">
              <span className={`text-6xl font-black ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                {score}
              </span>
              <span className="text-4xl text-slate-300 font-bold">/{questions.length}</span>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-8 ${
              isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPass ? <CheckCircleIcon className="w-5 h-5"/> : <XCircleIcon className="w-5 h-5"/>}
              {isPass ? 'उत्तीर्ण (बहुत बढ़िया!)' : 'सुधार की आवश्यकता है'}
            </div>

            <div className="flex justify-center gap-4">
               <button
                  onClick={handleBackToDashboard}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  डैशबोर्ड पर वापस जाएं
                </button>
               <button
                  onClick={() => handleStartChapter(selectedChapter!)}
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition-colors shadow-sm"
                >
                  पुनः प्रयास करें
                </button>
            </div>
          </div>

          {/* Detailed Review */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 px-2">विस्तृत उत्तर कुंजी</h3>
            {questions.map((q, index) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswerIndex;
              const userAnswerIndex = userAnswers[q.id];
              
              return (
                <div key={q.id} className={`bg-white rounded-xl shadow-sm border p-6 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                   <div className="flex items-start gap-4 mb-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{q.text}</p>
                      </div>
                   </div>

                   <div className="space-y-2 ml-12">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswerIndex === optIdx;
                        const isTheCorrectAnswer = q.correctAnswerIndex === optIdx;
                        
                        let styleClass = "border-slate-100 bg-slate-50 text-slate-500";
                        if (isTheCorrectAnswer) styleClass = "border-green-500 bg-green-50 text-green-900 font-medium";
                        else if (isSelected && !isTheCorrectAnswer) styleClass = "border-red-500 bg-red-50 text-red-900";

                        return (
                          <div key={optIdx} className={`p-3 rounded-lg border flex justify-between items-center ${styleClass}`}>
                             <span>{opt}</span>
                             {isTheCorrectAnswer && <span className="text-xs font-bold uppercase text-green-700 bg-green-200 px-2 py-1 rounded">सही उत्तर</span>}
                             {isSelected && !isTheCorrectAnswer && <span className="text-xs font-bold uppercase text-red-700 bg-red-200 px-2 py-1 rounded">आपका उत्तर</span>}
                          </div>
                        )
                      })}
                   </div>

                   <div className="mt-4 ml-12 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                      <div className="mt-0.5"><BookOpenIcon /></div>
                      <div>
                        <span className="font-bold block mb-1">व्याख्या:</span>
                        {q.explanation}
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {view === 'DASHBOARD' && renderDashboard()}
      {view === 'LOADING' && renderLoading()}
      {view === 'QUIZ' && renderQuiz()}
      {view === 'RESULTS' && renderResults()}
    </>
  );
}

export default App;
