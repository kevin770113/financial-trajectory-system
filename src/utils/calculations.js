/**
 * 核心運算引擎：將第一階段與第二階段的數據轉化為儀表板指標與觸發條件
 */

export const calculateMetrics = (stage1, stage2) => {
  // --- 基礎數值轉換 ---
  const age = Number(stage1.age) || 0;
  const retireAge = Number(stage1.retireAge) || 65;
  const activeIncome = Number(stage1.activeIncome) || 0;
  const passiveIncome = Number(stage1.passiveIncome) || 0;
  const rigidExpense = Number(stage1.rigidExpense) || 0;
  const safeCash = Number(stage1.safeCash) || 0;
  const investedAssets = Number(stage1.investedAssets) || 0;
  const debt = Number(stage1.debt) || 0;
  const pastAssets = Number(stage1.pastAssets) || 0;

  // --- 1. 現金流與防禦指標 ---
  const totalNetWorth = safeCash + investedAssets - debt;
  const theoreticalSurplus = (activeIncome + passiveIncome) - rigidExpense;
  const safeCashMonths = rigidExpense > 0 ? (safeCash / (rigidExpense / 12)) : 0;
  
  // 被動收入覆蓋率
  const passiveCoverage = rigidExpense > 0 ? (passiveIncome / rigidExpense) * 100 : 0;

  // --- 2. 成長斜率計算 ---
  // 年化成長率 (CAGR) 近似值：假設過去 3 年
  let cagr = 0;
  if (pastAssets > 0 && totalNetWorth > 0) {
    cagr = (Math.pow(totalNetWorth / pastAssets, 1 / 3) - 1) * 100;
  }

  // 實質資金留存率：利用(現在淨值 - 過去淨值) / 3 年，推算平均每年實質增加額，再除以理論餘裕
  let retentionRate = 0;
  if (theoreticalSurplus > 0) {
    const annualActualIncrease = (totalNetWorth - pastAssets) / 3;
    retentionRate = (annualActualIncrease / theoreticalSurplus) * 100;
    // 鎖定在 0~100% 區間防呆
    retentionRate = Math.max(0, Math.min(retentionRate, 100));
  }

  // --- 3. 動態題組觸發邏輯 (Stage 3 Triggers) ---
  const triggers = [];

  // Q1. 通膨認知：安全現金大於 150 萬 或 佔總資產大於 50%
  const totalAssets = safeCash + investedAssets;
  if (safeCash > 1500000 || (totalAssets > 0 && safeCash / totalAssets > 0.5)) {
    triggers.push('inflation');
  }

  // Q2. 槓桿心理：有負債即觸發
  if (debt > 0) {
    triggers.push('leverage');
  }

  // Q3. 景氣循環：有波動資產且風險容忍度非極度保守
  if (investedAssets > 0 && (stage2.lossTolerance === 'C' || stage2.lossTolerance === 'D')) {
    triggers.push('cyclicality');
  }

  // Q4. 被動現金流架構：距離退休/轉換期小於 15 年
  if ((retireAge - age) <= 15) {
    triggers.push('passiveFlow');
  }

  // Q5. 職涯防禦：年齡小於 45 或 距離退休大於 10 年
  if (age < 45 || (retireAge - age) > 10) {
    triggers.push('careerDefense');
  }

  // Q6. 資產傳承：年齡大於 50 或是剛性支出結構性增加(可能代表有扶養)
  if (age > 50 || stage1.pastExpenseTrend === 'D') {
    triggers.push('legacy');
  }

  // 如果觸發題數過少(極端情況)，補上通用題
  if (triggers.length === 0) triggers.push('passiveFlow', 'careerDefense');

  // --- 4. 回傳最終指標供第四階段儀表板使用 ---
  return {
    totalNetWorth,
    theoreticalSurplus,
    safeCashMonths,
    passiveCoverage,
    cagr,
    retentionRate,
    triggers,
    // 將計算結果打包，方便儀表板判定狀態(紅綠燈)
    statusMap: {
      momentum: retentionRate >= 70 ? '🟢 良好' : '🔴 耗損',
      defense: safeCashMonths >= 6 ? '🟢 穩健' : '🔴 脆弱',
      psychological: stage2.monitorFreq === 'C' || stage2.monitorFreq === 'D' ? '🔴 高負載' : '🟢 穩定',
    }
  };
};
