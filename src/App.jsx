import React from 'react'
import { useProfile } from './context/ProfileContext.jsx'
import { Sidebar } from './components/Sidebar/index.js'
import { SummaryCards } from './components/SummaryCards/index.js'
import { RegimeComparison } from './components/RegimeComparison/index.js'
import { EarningsForm, DeductionsForm, ExemptionsForm } from './components/InputPanel/index.js'
import { BreakdownDonut, ComponentsBar, Section80CBar } from './components/Charts/index.js'
import { PayslipPreview } from './components/PayslipPreview/index.js'
import { Edit2, Check } from 'lucide-react'

function App() {
  const { activeProfile, dispatch, loaded } = useProfile()
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [profileName, setProfileName] = React.useState('')
  
  React.useEffect(() => {
    if (activeProfile) {
      setProfileName(activeProfile.name)
    }
  }, [activeProfile])
  
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-neutral">Loading...</div>
      </div>
    )
  }
  
  if (!activeProfile) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">No Profile Selected</h2>
            <p className="text-neutral">Create a new profile to get started</p>
          </div>
        </main>
      </div>
    )
  }
  
  const handleNameSave = () => {
    if (profileName.trim()) {
      dispatch({ type: 'RENAME_PROFILE', payload: { id: activeProfile.id, name: profileName.trim() } })
    } else {
      setProfileName(activeProfile.name)
    }
    setIsEditingName(false)
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="text-xl font-medium px-2 py-1 border border-primary rounded focus:outline-none"
                    autoFocus
                  />
                  <button onClick={handleNameSave} className="p-1 hover:bg-gray-100 rounded">
                    <Check size={20} className="text-positive" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium">{activeProfile.name}</h2>
                  <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 size={16} className="text-neutral" />
                  </button>
                </div>
              )}
              <span className="text-xs text-neutral">
                {activeProfile.taxRegime === 'new' ? 'New Regime' : 'Old Regime'}
              </span>
            </div>
            <p className="text-xs text-neutral">
              Last updated: {new Date(activeProfile.updatedAt).toLocaleString('en-IN')}
            </p>
          </div>
          
          <SummaryCards />
          
          <RegimeComparison />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <EarningsForm />
            <DeductionsForm />
          </div>
          
          <ExemptionsForm />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <BreakdownDonut />
            <div className="md:col-span-2">
              <ComponentsBar />
            </div>
          </div>
          
          <Section80CBar />
          
          <PayslipPreview />
          
          <div className="mt-4 text-xs text-neutral text-center print:hidden">
            <p>⚠️ This calculator provides estimates. For exact figures, consult a Chartered Accountant.</p>
            <p>Surcharge (income &gt; ₹50L), marginal relief, and mid-year ESI transitions not calculated.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App