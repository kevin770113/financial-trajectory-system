import React from 'react';
import { useApp } from '../context/AppContext';

export default function Stage2Form() {
  const { stage2Data, updateStage2, setCurrentStage } = useApp();

  const questions = [
    {
      id: 'bonusAllocation',
      title: '1. 假設您今年領到一筆豐厚的年終獎金，您最真實的分配方式通常是？',
      options: [
        { value: 'A', text: '優先按原有比例投入既有的儲蓄與投資帳戶中，維持既定步調。' },
        { value: 'B', text: '撥出特定比例安排旅遊或購買高單價商品，剩餘資金再進行儲蓄。' },
        { value: 'C', text: '主要用於常態性生活品質的升級（如增加租屋預算、升級生活設備）。' },
        { value: 'D', text: '優先用於大額償還或提前結清目前負債，以降低未來固定支出。' },
      ]
    },
    {
      id: 'monitorFreq',
      title: '2. 在非發薪日、無重大帳單待繳的日子裡，您平均每週主動登入查看銀行餘額或投資對帳單的頻率為？',
      options: [
        { value: 'A', text: '幾乎不會（0 次）。設定好自動化流程後極少主動查看。' },
        { value: 'B', text: '偶爾確認（1-2 次）。維持基本的帳務掌握度。' },
        { value: 'C', text: '頻繁關注（3-5 次）。習慣性確認餘額或帳面損益才能感到安心。' },
        { value: 'D', text: '每日監控（6 次以上）。每天需多次確認數字變化。' },
      ]
    },
    {
      id: 'deferExpense',
      title: '3. 回顧過去一年，您是否曾因為「預算考量或現金流吃緊」，而決定「遞延」具備必要或預防性的支出（如健康檢查、牙齒治療、預防性保養）？',
      options: [
        { value: 'A', text: '0 次。預防性支出皆按計畫執行，不受短期現金流影響。' },
        { value: 'B', text: '1-2 次。曾因當月支出較高而稍微延後，但最終仍有執行。' },
        { value: 'C', text: '3 次以上。經常需要為維持日常現金流而無限期擱置預防性支出。' },
      ]
    },
    {
      id: 'sleepImpact',
      title: '4. 當整體經濟環境不佳或面臨大額開銷時，這類財務波動影響您「實際睡眠品質或造成生理疲勞」的頻率為？',
      options: [
        { value: 'A', text: '從未影響。能將財務波動與日常生理作息完全隔離。' },
        { value: 'B', text: '偶有波動。極端事件發生當下會受影響，但能在數日內恢復。' },
        { value: 'C', text: '顯著干擾。只要資產水位下降，就會常態性引發睡眠中斷。' },
      ]
    },
    {
      id: 'lossTolerance',
      title: '5. 當持有的波動性投資資產在短期內遭遇市場劇烈修正，您「最大能承受」的帳面虧損幅度是多少（能維持決策平穩）？',
      options: [
        { value: 'A', text: '0%。偏好絕對保本，若出現虧損會傾向轉換為無波動資產。' },
        { value: 'B', text: '下跌 10% 以內。超過此區間會傾向先獲利了結或停損變現。' },
        { value: 'C', text: '下跌 20% - 30%。會維持現有投資部位，等待市場週期回穩。' },
        { value: 'D', text: '下跌 40% - 50% 或以上。視為正常週期，且會考慮將閒餘資金繼續投入。' },
      ]
    },
    {
      id: 'healthRecovery',
      title: '6. 與 3 年前相比，您目前對於「連續高壓工作後的體力恢復速度」的客觀感受是？',
      options: [
        { value: 'A', text: '恢復速度不變或更好（有規律運動與健康管理維持）。' },
        { value: 'B', text: '恢復速度略微下降，需要比以前多休息一兩天。' },
        { value: 'C', text: '恢復速度顯著下降，經常感到慢性疲勞難以完全恢復。' },
      ]
    }
  ];

  const handleOptionClick = (questionId, value) => {
    updateStage2({ [questionId]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-4 border-primary">
      <h2 className="text-2xl font-bold text-primary mb-2">第二階段：習慣與心理評估</h2>
      <p className="text-gray-500 mb-6 text-sm">請依照您最真實的直覺作答，這將幫助系統量化您的心理負載。</p>

      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">{q.title}</h3>
            <div className="space-y-3">
              {q.options.map((opt) => {
                const isSelected = stage2Data[q.id] === opt.value;
                return (
                  <div 
                    key={opt.value}
                    onClick={() => handleOptionClick(q.id, opt.value)}
                    className={`p-3 rounded-md cursor-pointer border transition-all ${
                      isSelected 
                        ? 'bg-accent/10 border-accent text-primary font-medium' 
                        : 'bg-white border-gray-200 hover:border-accent/50 text-gray-600'
                    }`}
                  >
                    {opt.text}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => setCurrentStage(1)}
          className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          回上一步
        </button>
        <button 
          onClick={() => setCurrentStage(3)}
          className="w-2/3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
        >
          前往分析與深挖
        </button>
      </div>
    </div>
  );
}
