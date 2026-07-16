import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMetrics } from '../utils/calculations';

export default function Stage3Form() {
  const { stage1Data, stage2Data, stage3Data, updateStage3, setCurrentStage, setComputedMetrics } = useApp();
  const [triggers, setTriggers] = useState([]);

  useEffect(() => {
    const metrics = calculateMetrics(stage1Data, stage2Data);
    setTriggers(metrics.triggers);
    setComputedMetrics(metrics);
  }, [stage1Data, stage2Data, setComputedMetrics]);

  const allQuestions = {
    inflation: {
      id: 'inflation',
      title: '關於您持有的「安全現金」，在面對未來預期 2%~3% 的通膨時，您的長期調度邏輯是？',
      options: [
        { value: 'A', text: '將資金的絕對安全性排在首位，視購買力耗損為合理成本。' },
        { value: 'B', text: '主動尋求極低風險的貨幣市場工具減緩通膨，但不參與波動市場。' },
        { value: 'C', text: '視為戰略預備金，等待市場出現特定進場點後分批轉入波動資產。' },
        { value: 'D', text: '傾向留存於日常帳戶中保持最高流動性，暫不進行額外規劃。' },
      ]
    },
    leverage: {
      id: 'leverage',
      title: '若市場出現長期年化報酬率「高於」您目前負債利率的投資機會，您傾向如何調度資金？',
      options: [
        { value: 'A', text: '優先加速還款，將「零負債的確定性」作為首要目標。' },
        { value: 'B', text: '維持原訂還款節奏，將剩餘資金投入該機會，雙軌並行。' },
        { value: 'C', text: '考量在可控範圍內增加低利借貸，擴大投入以最大化利差。' },
        { value: 'D', text: '財務決策上將維持現狀排在賺取潛在利差之前，以保本為重。' },
      ]
    },
    cyclicality: {
      id: 'cyclicality',
      title: '當整體經濟環境進入明顯的衰退期，您對手中「可支配資金」與「投資計畫」最可能的操作是？',
      options: [
        { value: 'A', text: '採取戰術性保留，暫停投入資金並提高現金部位，待復甦後再恢復。' },
        { value: 'B', text: '維持既有的資金投入紀律與固定節奏，不因此改變配置。' },
        { value: 'C', text: '視衰退期為資產積累加速點，主動調度備用金逢低增加投入。' },
        { value: 'D', text: '啟動防禦機制，將波動性資產轉換為避險工具以降低波動。' },
      ]
    },
    passiveFlow: {
      id: 'passiveFlow',
      title: '關於您未來期望打造的「被動/資產現金流」，您個人最偏好的組成方式是？',
      options: [
        { value: 'A', text: '實體不動產收租。偏好實體價值且具備抗通膨特性。' },
        { value: 'B', text: '有價證券配息。重視高流動性，不需投入實體管理維護時間。' },
        { value: 'C', text: '企業系統或版稅。偏好前期建立結構，後期持續產生收益。' },
        { value: 'D', text: '總報酬提領。傾向極大化總資產規模，未來再依實際需求比例提領。' },
      ]
    },
    careerDefense: {
      id: 'careerDefense',
      title: '若未來您所在的產業面臨重大變革（如技術迭代），您的財務與職涯應對策略是？',
      options: [
        { value: 'A', text: '趁目前紅利期大幅提高投資率，提早將主動收入轉換為資本。' },
        { value: 'B', text: '將部分資源投資於跨領域學習，確保具備平滑轉移的彈性。' },
        { value: 'C', text: '採取深度專精策略，爭取不可取代的位置以高度稀缺性抵禦衝擊。' },
        { value: 'D', text: '保持現狀高度彈性，專注維持當下穩定性，保留最大的決策餘裕。' },
      ]
    },
    legacy: {
      id: 'legacy',
      title: '關於您一生所累積的資產，您對於「跨代傳承」或「晚年分配」的基礎規劃傾向於？',
      options: [
        { value: 'A', text: '資源生命週期極大化。規劃全數用於提升個人晚年生活，以生前運用完畢為設定。' },
        { value: 'B', text: '特定實體資產保留。規劃具體項目（如自住房）留給後代，其餘自行消耗。' },
        { value: 'C', text: '永續傳承架構。透過信託或核心資產建立系統，讓後代持續享有紅利。' },
        { value: 'D', text: '彈性運用模式。依當下需求自然運用，不預設傳承比例，剩餘交由繼承人。' },
      ]
    }
  };

  const handleOptionClick = (questionId, value) => {
    updateStage3({ [questionId]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-4 border-primary">
      {/* 改版：柔化標題，移除系統動態深挖字眼 */}
      <h2 className="text-2xl font-bold text-primary mb-2">關於未來的財務藍圖</h2>
      <p className="text-gray-500 mb-6 text-sm">最後，我們想進一步了解您對未來資金調度與風險的偏好。</p>

      <div className="space-y-8">
        {triggers.map((triggerKey) => {
          const q = allQuestions[triggerKey];
          if (!q) return null;
          
          return (
            <div key={q.id} className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-100">
              {/* 改版：徹底移除 [條件觸發] 的開發者除錯標籤 */}
              <h3 className="font-semibold text-gray-800 mb-4">{q.title}</h3>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  const isSelected = stage3Data[q.id] === opt.value;
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
          );
        })}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => setCurrentStage(2)}
          className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          上一頁
        </button>
        <button 
          onClick={() => setCurrentStage(4)}
          className="w-2/3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
        >
          看分析結果
        </button>
      </div>
    </div>
  );
}
