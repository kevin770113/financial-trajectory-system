import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Stage1Form from './components/Stage1Form';
import Stage2Form from './components/Stage2Form';
import Stage3Form from './components/Stage3Form';
import Dashboard from './components/Dashboard';

function MainContent() {
  const { currentStage } = useApp();

  // 改版：將生硬的工程/測量名詞換成平易近人的引導語
  const stages = [
    { num: 1, name: '現狀盤點' },
    { num: 2, name: '生活情境' },
    { num: 3, name: '未來藍圖' },
    { num: 4, name: '專屬分析' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 font-sans">
      
      {/* 頂部進度條指示器 */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-accent transition-all duration-300 ease-in-out -z-10"
            style={{ width: `${((currentStage - 1) / 3) * 100}%` }}
          ></div>
          
          {stages.map((stage) => {
            const isActive = currentStage === stage.num;
            const isPast = currentStage > stage.num;
            
            return (
              <div key={stage.num} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2
                    ${isActive ? 'bg-accent text-white border-accent' : ''}
                    ${isPast ? 'bg-primary text-white border-primary' : ''}
                    ${!isActive && !isPast ? 'bg-white text-gray-400 border-gray-300' : ''}
                  `}
                >
                  {isPast ? '✓' : stage.num}
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive || isPast ? 'text-primary' : 'text-gray-400'}`}>
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 依據目前階段切換顯示的元件 */}
      <div className="transition-opacity duration-300">
        {currentStage === 1 && <Stage1Form />}
        {currentStage === 2 && <Stage2Form />}
        {currentStage === 3 && <Stage3Form />}
        {currentStage === 4 && <Dashboard />}
      </div>
      
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
