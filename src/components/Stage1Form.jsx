import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Stage1Form() {
  const { stage1Data, updateStage1, setCurrentStage } = useApp();
  
  // 為了自訂選單新增的狀態與 Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateStage1({ [name]: value });
  };

  // 點擊空白處關閉選單的監聽器
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 自訂選單的選項定義
  const expenseOptions = [
    { value: 'A', label: '顯著減少 (下降 20% 以上：如車貸/房貸清償)' },
    { value: 'B', label: '維持平穩 (增減 10% 以內：無重大生活結構改變)' },
    { value: 'C', label: '溫和增加 (增加 10% - 30%：隨通膨或小額支出調升)' },
    { value: 'D', label: '結構性增加 (增加 30% 以上：如買房繳息、新生兒、長輩照護)' }
  ];

  const handleCustomSelect = (value) => {
    updateStage1({ pastExpenseTrend: value });
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-4 border-primary">
      <h2 className="text-2xl font-bold text-primary mb-2">讓我們了解您目前的財務輪廓</h2>
      <p className="text-gray-500 mb-6 text-sm">請填寫最接近真實狀況的概略數字，不需翻找精確對帳單。我們將透過這些基本資訊為您建立專屬的財務軌跡。</p>

      <div className="space-y-6">
        {/* 一、 基礎時間軸 */}
        <div>
          <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-4">一、 基礎時間軸與近期變化</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block font-medium mb-1">1. 您的目前年齡？</label>
              <input type="number" name="age" value={stage1Data.age} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="例：35" />
            </div>
            
            <div>
              <label className="block font-medium mb-1">2. 您預期在哪個年齡大幅改變工作型態或完全退休？</label>
              <p className="text-xs text-gray-500 mb-2">指不再依賴全職薪水，能自由安排時間的目標年紀。例：60</p>
              <input type="number" name="retireAge" value={stage1Data.retireAge} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="例：60" />
            </div>

            <div>
              <label className="block font-medium mb-1">3. 回顧 3 年前，當時您的「總資產規模」大約是多少？</label>
              <p className="text-xs text-gray-500 mb-2">包含當時的存款、股票等總和。這能幫助系統了解您近期的資產累積速度。</p>
              <input type="number" name="pastAssets" value={stage1Data.pastAssets} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>

            <div>
              <label className="block font-medium mb-1">4. 與 3 年前相比，目前家庭的「剛性支出」變化狀態是？</label>
              <p className="text-xs text-gray-500 mb-2">例如房貸、租金、基本家用或扶養費用的變化。</p>
              
              {/* 改版：自訂精緻下拉選單 */}
              <div className="relative" ref={dropdownRef}>
                <div 
                  className={`w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-accent outline-none cursor-pointer flex justify-between items-center ${
                    isDropdownOpen ? 'ring-2 ring-accent border-accent' : ''
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={stage1Data.pastExpenseTrend ? "text-gray-800 text-sm" : "text-gray-400 text-sm"}>
                    {stage1Data.pastExpenseTrend 
                      ? expenseOptions.find(opt => opt.value === stage1Data.pastExpenseTrend)?.label 
                      : "請點擊選擇..."}
                  </span>
                  <span className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                    {expenseOptions.map((opt) => (
                      <div 
                        key={opt.value}
                        className={`p-3 text-sm cursor-pointer border-b last:border-b-0 border-gray-100 transition-colors ${
                          stage1Data.pastExpenseTrend === opt.value ? 'bg-accent/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => handleCustomSelect(opt.value)}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 二、 現金流量現況 */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-4">二、 年度現金流量</h3>
          <div className="space-y-5">
            <div>
              <label className="block font-medium mb-1">1. 每年確定的「主動收入」大約是多少？</label>
              <p className="text-xs text-gray-500 mb-2">例：每月實領本薪 5 萬 × 12 個月 + 固定年終 10 萬 = 70 萬。（請勿高估不穩定的獎金）</p>
              <input type="number" name="activeIncome" value={stage1Data.activeIncome} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>
            <div>
              <label className="block font-medium mb-1">2. 每年可預期的「被動與資產收入」大約是多少？</label>
              <p className="text-xs text-gray-500 mb-2">如：銀行定存利息、目前的股息或收租。若無請填 0。</p>
              <input type="number" name="passiveIncome" value={stage1Data.passiveIncome} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="若無填 0" />
            </div>
            <div>
              <label className="block font-medium mb-1">3. 每年不可避免的「剛性生存支出」大約是多少？</label>
              <p className="text-xs text-gray-500 mb-2">例：房租房貸 + 基礎三餐 + 水電通信費 + 勞健保稅金。請想像在「完全不娛樂、不買非必需品」的情況下，維持生活的最底線開銷。</p>
              <input type="number" name="rigidExpense" value={stage1Data.rigidExpense} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>
          </div>
        </div>

        {/* 三、 靜態資產與負債現況 */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-4">三、 現有資產與負債盤點</h3>
          <div className="space-y-5">
            <div>
              <label className="block font-medium mb-1">1. 目前可快速動用的「安全現金」總共有多少？</label>
              <p className="text-xs text-gray-500 mb-2">幾天內就能變現且保本的資金。如：銀行活存、定存、外幣存款總額。</p>
              <input type="number" name="safeCash" value={stage1Data.safeCash} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="金額 (元)" />
            </div>
            <div>
              <label className="block font-medium mb-1">2. 目前「波動性投資資產」的現值大約多少？</label>
              <p className="text-xs text-gray-500 mb-2">目前帳上的投資總市值，不需要管成本，看現在值多少錢。如：股票、ETF、基金、加密貨幣等。若無填 0。</p>
              <input type="number" name="investedAssets" value={stage1Data.investedAssets} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="若無填 0" />
            </div>
            <div>
              <label className="block font-medium mb-1">3. 尚未清償的「負債總額」大約多少？</label>
              <p className="text-xs text-gray-500 mb-2">您目前還欠銀行或他人多少本金。如：剩餘房貸本金 800 萬 + 信貸 50 萬。若無填 0。</p>
              <input type="number" name="debt" value={stage1Data.debt} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none" placeholder="若無填 0" />
            </div>
          </div>
        </div>

      </div>

      <button 
        onClick={() => setCurrentStage(2)}
        className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
      >
        儲存並進入下一頁
      </button>
    </div>
  );
}
