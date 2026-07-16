import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 控制目前所在的階段 (1~4)
  const [currentStage, setCurrentStage] = useState(1);

  // 第一階段：客觀數據
  const [stage1Data, setStage1Data] = useState({
    age: '',
    retireAge: '',
    pastAssets: '',
    pastExpenseTrend: '',
    activeIncome: '',
    passiveIncome: '',
    rigidExpense: '',
    safeCash: '',
    investedAssets: '',
    debt: '',
  });

  // 第二階段：習慣與心理負載 (預設為空字串，對應選項 A/B/C/D)
  const [stage2Data, setStage2Data] = useState({
    bonusAllocation: '',
    monitorFreq: '',
    deferExpense: '',
    sleepImpact: '',
    lossTolerance: '',
    healthRecovery: '',
  });

  // 第三階段：動態深挖答案儲存
  const [stage3Data, setStage3Data] = useState({});

  // 儲存後台計算結果
  const [computedMetrics, setComputedMetrics] = useState(null);

  // 統一更新函式
  const updateStage1 = (data) => setStage1Data({ ...stage1Data, ...data });
  const updateStage2 = (data) => setStage2Data({ ...stage2Data, ...data });
  const updateStage3 = (data) => setStage3Data({ ...stage3Data, ...data });

  return (
    <AppContext.Provider
      value={{
        currentStage,
        setCurrentStage,
        stage1Data,
        updateStage1,
        stage2Data,
        updateStage2,
        stage3Data,
        updateStage3,
        computedMetrics,
        setComputedMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
