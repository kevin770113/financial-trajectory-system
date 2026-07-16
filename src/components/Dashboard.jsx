import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Info, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { stage1Data, stage2Data, computedMetrics, setCurrentStage } = useApp();

  if (!computedMetrics) {
    return <div className="text-center p-10 text-gray-500">資料運算中，請稍候...</div>;
  }

  const { 
    totalNetWorth, theoreticalSurplus, safeCashMonths, 
    passiveCoverage, cagr, retentionRate 
  } = computedMetrics;

  const pastAssets = Number(stage1Data.pastAssets) || 0;
  const rigidExpense = Number(stage1Data.rigidExpense) || 0;
  const safeCash = Number(stage1Data.safeCash) || 0;
  
  // 支出膨脹係數
  let expenseMultiplier = 1;
  if (stage1Data.pastExpenseTrend === 'A') expenseMultiplier = 0.8;
  if (stage1Data.pastExpenseTrend === 'C') expenseMultiplier = 1.2;
  if (stage1Data.pastExpenseTrend === 'D') expenseMultiplier = 1.4;

  // --- 三種未來推演劇本 (簡易複利模型) ---
  const baseGrowthRate = Math.max(cagr, 2); // 避免負值導致推演崩潰，最低抓 2%
  
  // 劇本一：維持現狀 (現有資產依原速度增長 + 現有留存資金單純累積)
  const future10YearsNetWorth = totalNetWorth * Math.pow(1 + (baseGrowthRate / 100), 10) + ((theoreticalSurplus * (retentionRate / 100)) * 10);
  const future10YearsExpense = rigidExpense * expenseMultiplier * Math.pow(1.02, 10); // 2% 基礎通膨
  
  // 劇本二：微幅調整 (修復漏水，將留存率拉高至 80%)
  const futureMinorFix = totalNetWorth * Math.pow(1 + (baseGrowthRate / 100), 10) + ((theoreticalSurplus * 0.8) * 10);

  // 劇本三：積極調整 (修復漏水 + 將超過6個月的安全現金轉入投資提高整體報酬率 3% + 投資健康延長高收入期多賺3年)
  const optimizedGrowthRate = baseGrowthRate + 3;
  const futureAggressive = totalNetWorth * Math.pow(1 + (optimizedGrowthRate / 100), 10) + ((theoreticalSurplus * 0.8) * 13);

  const formatCurrency = (num) => Math.round(num || 0).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">專屬財務軌跡與潛力分析</h2>
        <p className="text-gray-500 text-sm">根據您的現狀與生活慣性，推演出來的客觀數據報告</p>
      </div>

      {/* --- 第一部分：時間軸 (手機友善卡片) --- */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent rounded-full"></span>
          一、 財務規模變化軌跡
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 總資產卡片 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-gray-700 flex items-center gap-1">
                總淨值規模
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  <div className="hidden group-hover:block absolute z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                    包含存款與投資，扣除負債後的真實身價。
                  </div>
                </div>
              </h4>
              {cagr > 5 ? <TrendingUp className="text-green-500 w-5 h-5" /> : <TrendingDown className="text-yellow-500 w-5 h-5" />}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">3 年前</p>
                <p className="font-medium text-gray-600">${formatCurrency(pastAssets)}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">目前</p>
                <p className="font-bold text-blue-600 text-lg">${formatCurrency(totalNetWorth)}</p>
              </div>
            </div>
            <div className={`mt-4 p-2 rounded text-xs text-center font-medium ${cagr > 5 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
              年化成長率約 {cagr.toFixed(1)}%
            </div>
          </div>

          {/* 支出膨脹卡片 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-400"></div>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-gray-700 flex items-center gap-1">
                每年剛性支出
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                  <div className="hidden group-hover:block absolute right-0 z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                    為了維持生存與不違約，每年最少必須花費的錢。
                  </div>
                </div>
              </h4>
              {expenseMultiplier > 1.1 ? <TrendingUp className="text-red-500 w-5 h-5" /> : <TrendingDown className="text-green-500 w-5 h-5" />}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">目前水位</p>
                <p className="font-bold text-rose-500 text-lg">${formatCurrency(rigidExpense)}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">未來 10 年預估</p>
                <p className="font-medium text-gray-600">${formatCurrency(future10YearsExpense)}</p>
              </div>
            </div>
            <div className={`mt-4 p-2 rounded text-xs text-center font-medium ${expenseMultiplier > 1.1 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {expenseMultiplier > 1.1 ? '⚠️ 支出膨脹過快，將抵銷資產成長' : '✅ 支出控制良好，有利資金累積'}
            </div>
          </div>
        </div>
      </div>

      {/* --- 第二部分：四大健康度指標 (白話文與好壞判定) --- */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent rounded-full"></span>
          二、 財務體質檢驗
        </h3>

        <div className="grid grid-cols-1 gap-4">
          
          {/* 指標 1 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 border-4 border-white shadow-sm">
              <span className={`text-xl font-bold ${retentionRate >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                {retentionRate.toFixed(0)}%
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                實質資金留存率
                {retentionRate >= 70 ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <AlertCircle className="w-4 h-4 text-red-500"/>}
              </h4>
              <p className="text-xs text-gray-500 mt-1 mb-2">這代表您「理論上該存下來的錢」與「帳戶實際多出來的錢」的比例。</p>
              <p className={`text-sm p-2 rounded bg-opacity-10 ${retentionRate >= 70 ? 'bg-green-500 text-green-700' : 'bg-red-500 text-red-700'}`}>
                {retentionRate >= 70 
                  ? '🟢 狀態極佳：您具備良好的消費紀律，每一分收入都有確實轉換為個人資產。' 
                  : '🔴 隱憂提醒：比例低於標準。這代表您有嚴重的「隱形消費」（如無意識的小額疊加或衝動購物），錢在不知不覺中流失了。'}
              </p>
            </div>
          </div>

          {/* 指標 2 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
             <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 border-4 border-white shadow-sm">
              <span className={`text-xl font-bold ${safeCashMonths >= 6 ? 'text-green-500' : 'text-red-500'}`}>
                {safeCashMonths.toFixed(0)}
                <span className="text-xs ml-1">個月</span>
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                財務容錯率 (安全水位)
                {safeCashMonths >= 6 ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <AlertCircle className="w-4 h-4 text-red-500"/>}
              </h4>
              <p className="text-xs text-gray-500 mt-1 mb-2">如果明天突然失去工作，您手上的安全存款能讓家庭安穩生活的時間。</p>
              <p className={`text-sm p-2 rounded bg-opacity-10 ${safeCashMonths >= 6 ? 'bg-green-500 text-green-700' : 'bg-red-500 text-red-700'}`}>
                {safeCashMonths >= 6 
                  ? '🟢 狀態穩健：安全存款大於 6 個月。遇到突發變故時，您有充裕的時間可以調度找工作，不需恐慌。' 
                  : '🔴 隱憂提醒：安全水位極低。您目前的生活幾乎完全依賴下個月的薪水，承受意外的容錯率非常低。'}
              </p>
            </div>
          </div>

          {/* 指標 3 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">人力資本折舊狀態</h4>
              <p className="text-xs text-gray-500 mt-1 mb-2">評估您賺取主動收入的「身體本錢」是否正在加速消耗。</p>
              <p className={`text-sm p-2 rounded bg-opacity-10 ${stage2Data.healthRecovery === 'C' ? 'bg-red-500 text-red-700' : 'bg-green-500 text-green-700'}`}>
                {stage2Data.healthRecovery === 'C' 
                  ? '🔴 隱憂提醒：體力恢復變差。目前的財務積累可能是用「透支健康」換來的，未來極易轉化為高昂的醫療開銷，並迫使您提早退出職場。' 
                  : '🟢 狀態穩健：作息控制得宜。您有較高的機率可以拉長主動收入的高峰期，持續累積本金。'}
              </p>
            </div>
          </div>

          {/* 指標 4 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">心理負載 (財務焦慮度)</h4>
              <p className="text-xs text-gray-500 mt-1 mb-2">測量您每天需要花多少注意力在盯盤或擔憂金錢上。</p>
              <p className={`text-sm p-2 rounded bg-opacity-10 ${stage2Data.monitorFreq === 'C' || stage2Data.monitorFreq === 'D' ? 'bg-red-500 text-red-700' : 'bg-blue-500 text-blue-700'}`}>
                {stage2Data.monitorFreq === 'C' || stage2Data.monitorFreq === 'D'
                  ? '🔴 隱憂提醒：您對數字波動高度敏感，注意力大量被財務綁定。這不僅容易造成決策疲勞，更可能影響本業的專注度。建議建立自動化投資隔離情緒。' 
                  : '🔵 狀態良好：您能將財務規劃與日常生活良好隔離，具備成熟的抗壓心態。'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- 第三部分：未來劇本 (加入積極調整) --- */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent rounded-full"></span>
          三、 未來 10 年的蝴蝶效應
        </h3>
        <p className="text-sm text-gray-500 px-2 mb-4">系統為您模擬：如果從今天起改變一個小習慣，未來的財富天花板會有何不同。</p>

        <div className="space-y-3">
          {/* 劇本 1 */}
          <div className="bg-white border-l-4 border-gray-400 p-4 rounded-r-xl shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-gray-500">劇本一：維持現狀慣性</span>
              <span className="text-xl font-bold text-gray-700">${formatCurrency(future10YearsNetWorth)}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              維持目前的儲蓄率與生活習慣。您的資產會成長，但若未改善隱形消費或健康透支，未來可能面臨提早退休資金不足的壓力。
            </p>
          </div>

          {/* 劇本 2 */}
          <div className="bg-white border-l-4 border-blue-400 p-4 rounded-r-xl shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-blue-600">劇本二：微幅調整 (修復財務漏水)</span>
              <span className="text-xl font-bold text-blue-600">${formatCurrency(futureMinorFix)}</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              只要每月有意識地抓出「隱形開銷」，將真實留存率拉高至 80%，單純靠著守住本金，10 年後就能無痛多出可觀的預備金。
            </p>
          </div>

          {/* 劇本 3 */}
          <div className="bg-white border-l-4 border-accent p-4 rounded-r-xl shadow-md bg-gradient-to-r from-blue-50 to-white">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-accent">劇本三：積極調整 (優化配置與健康)</span>
              <span className="text-2xl font-bold text-accent">${formatCurrency(futureAggressive)}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              除了修復漏水，若您能將過多的「閒置安全現金」轉入抗通膨資產，並將部分預算投資於「運動與睡眠」使高收入期多延長 3 年。在複利雙引擎推動下，將大幅拉開與現狀的差距。
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={() => setCurrentStage(1)}
          className="text-gray-400 hover:text-primary underline text-sm"
        >
          重新進行盤點
        </button>
      </div>

    </div>
  );
}
