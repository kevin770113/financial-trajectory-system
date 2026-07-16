import React from 'react';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { stage1Data, stage2Data, computedMetrics, setCurrentStage } = useApp();

  if (!computedMetrics) {
    return <div className="text-center p-10">資料運算中，請稍候...</div>;
  }

  // 解構變數以利排版
  const { 
    totalNetWorth, theoreticalSurplus, safeCashMonths, 
    passiveCoverage, cagr, retentionRate, statusMap 
  } = computedMetrics;

  const pastAssets = Number(stage1Data.pastAssets) || 0;
  const rigidExpense = Number(stage1Data.rigidExpense) || 0;
  
  // 簡易推算未來 10 年資產 (以現有總資產與留存資金投入，粗略以 CAGR 成長)
  const future10YearsNetWorth = totalNetWorth * Math.pow(1 + (cagr / 100), 10) + ((theoreticalSurplus * (retentionRate / 100)) * 10);
  // 簡易推算未來 10 年剛性支出膨脹 (依據第一階段選項給定膨脹係數)
  let expenseMultiplier = 1;
  if (stage1Data.pastExpenseTrend === 'A') expenseMultiplier = 0.8;
  if (stage1Data.pastExpenseTrend === 'C') expenseMultiplier = 1.2;
  if (stage1Data.pastExpenseTrend === 'D') expenseMultiplier = 1.4;
  const future10YearsExpense = rigidExpense * expenseMultiplier * Math.pow(1.02, 10); // 加上每年2%基礎通膨

  const formatCurrency = (num) => Math.round(num).toLocaleString();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-8 border-primary">
        <h2 className="text-3xl font-bold text-primary mb-2 text-center">全人理財軌跡與客觀診斷報告</h2>
        <p className="text-center text-gray-500 mb-8">基於客觀數據與行為慣性所推演的軌跡模型</p>

        {/* 第一部分：軌跡時間軸 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-secondary mb-4 border-l-4 border-accent pl-3">一、 全人軌跡時間軸</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 border-b">時間維度</th>
                  <th className="p-3 border-b">過去 (3年前基準)</th>
                  <th className="p-3 border-b">目前現況</th>
                  <th className="p-3 border-b">未來10年 (慣性延續)</th>
                  <th className="p-3 border-b">狀態判定</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-medium">總淨值規模</td>
                  <td className="p-3 border-b">{formatCurrency(pastAssets)}</td>
                  <td className="p-3 border-b text-primary font-bold">{formatCurrency(totalNetWorth)}</td>
                  <td className="p-3 border-b">{formatCurrency(future10YearsNetWorth)}</td>
                  <td className={`p-3 border-b font-bold ${cagr > 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                    年化成長 {cagr.toFixed(1)}%
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border-b font-medium">剛性支出水位</td>
                  <td className="p-3 border-b">-</td>
                  <td className="p-3 border-b text-primary font-bold">{formatCurrency(rigidExpense)} / 年</td>
                  <td className="p-3 border-b">{formatCurrency(future10YearsExpense)} / 年</td>
                  <td className={`p-3 border-b font-bold ${expenseMultiplier > 1.1 ? 'text-red-600' : 'text-green-600'}`}>
                    {expenseMultiplier > 1.1 ? '支出膨脹結構' : '紀律控制'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">被動收入覆蓋率</td>
                  <td className="p-3 border-b">-</td>
                  <td className="p-3 border-b text-primary font-bold">{passiveCoverage.toFixed(1)}%</td>
                  <td className="p-3 border-b">預期上升</td>
                  <td className="p-3 border-b font-bold text-gray-600">依賴度移轉分析</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 第二部分：量化指標 */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-secondary mb-4 border-l-4 border-accent pl-3">二、 四大維度健康度量化指標</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 卡片 1 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-bold text-primary mb-3 pb-2 border-b border-gray-300">1. 財務動能 (Momentum)</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">實質資金留存率</span>
                <span className={`font-bold ${retentionRate >= 70 ? 'text-green-600' : 'text-red-600'}`}>{retentionRate.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">系統綜合判定</span>
                <span className="font-bold">{statusMap.momentum}</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">*低於 70% 顯示系統存在隱性耗損，資金轉化率未達理論水準。</p>
            </div>

            {/* 卡片 2 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-bold text-primary mb-3 pb-2 border-b border-gray-300">2. 人力資本 (Human Capital)</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">人力折舊斜率</span>
                <span className={`font-bold ${stage2Data.healthRecovery === 'C' ? 'text-red-600' : 'text-green-600'}`}>
                  {stage2Data.healthRecovery === 'A' ? '持平/正向' : (stage2Data.healthRecovery === 'B' ? '微幅折舊' : '負向下降')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3">*體力恢復度指標，若為負向下降，系統推演將調降未來主動收入的延長預期。</p>
            </div>

            {/* 卡片 3 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-bold text-primary mb-3 pb-2 border-b border-gray-300">3. 系統容錯率 (Fault Tolerance)</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">單點故障防禦力</span>
                <span className={`font-bold ${safeCashMonths >= 6 ? 'text-green-600' : 'text-red-600'}`}>{safeCashMonths.toFixed(1)} 個月</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">系統綜合判定</span>
                <span className="font-bold">{statusMap.defense}</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">*主動收入中斷時，純靠安全現金支撐剛性支出的時間。</p>
            </div>

            {/* 卡片 4 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-bold text-primary mb-3 pb-2 border-b border-gray-300">4. 心理負載 (Psychological Load)</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">財務注意力綁定</span>
                <span className={`font-bold ${stage2Data.monitorFreq === 'C' || stage2Data.monitorFreq === 'D' ? 'text-red-600' : 'text-green-600'}`}>
                  {stage2Data.monitorFreq === 'C' || stage2Data.monitorFreq === 'D' ? '高度消耗' : '健康隔離'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">系統綜合判定</span>
                <span className="font-bold">{statusMap.psychological}</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">*測量資產波動對日常注意力的實質干擾程度。</p>
            </div>

          </div>
        </div>

        {/* 第三部分：客觀推演 */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-secondary mb-4 border-l-4 border-accent pl-3">三、 客觀推演與敏感度測試</h3>
          <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 space-y-4">
            <div>
              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">現狀慣性推演</span>
              <p className="text-gray-700 text-sm">
                若持續維持目前的資金留存率與人力資本折舊狀態，10 年後您的總資產規模預估將推進至 <strong>{formatCurrency(future10YearsNetWorth)}</strong> 區間。然而，您的剛性支出也將因通膨與結構改變同步推升至 <strong>{formatCurrency(future10YearsExpense)}</strong>。
              </p>
            </div>
            <div className="pt-4 border-t border-blue-200">
              <span className="inline-block bg-accent text-white text-xs px-2 py-1 rounded mb-2">微調變數推演</span>
              <p className="text-gray-700 text-sm">
                若能將目前的「隱性耗損資金」有效控管使留存率提升 15%，並透過「自動化配置」降低財務對注意力的綁定，不僅 10 年後總資產能具備更寬裕的安全邊際，亦可大幅減緩心理負載對主動收入高峰期的折損。
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <button 
            onClick={() => setCurrentStage(1)}
            className="text-gray-500 hover:text-primary underline text-sm"
          >
            重新進行測驗
          </button>
        </div>

      </div>
    </div>
  );
}
