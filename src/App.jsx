import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 10
const STIMULUS_DURATION = 1000
const RESPONSE_TIMEOUT = 2000
const FIXATION_SIZE = 20

function generateTestPoints() {
  const points = []
  const step = 100 / (GRID_SIZE + 1)

  for (let i = 1; i <= GRID_SIZE; i++) {
    for (let j = 1; j <= GRID_SIZE; j++) {
      const x = step * i
      const y = step * j
      const distFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2))
      if (distFromCenter > 5 && distFromCenter < 45) {
        points.push({ x, y, id: `${i}-${j}` })
      }
    }
  }

  return points.sort(() => Math.random() - 0.5)
}

function App() {
  const [phase, setPhase] = useState('setup')
  const [testPoints, setTestPoints] = useState([])
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [showStimulus, setShowStimulus] = useState(false)
  const [results, setResults] = useState({})
  const [stimulusSize, setStimulusSize] = useState(8)
  const [stimulusColor, setStimulusColor] = useState('#ffffff')
  const [backgroundColor, setBackgroundColor] = useState('#808080')
  const [testEye, setTestEye] = useState('right')
  const [awaitingResponse, setAwaitingResponse] = useState(false)
  const responseTimeoutRef = useRef(null)
  const stimulusTimeoutRef = useRef(null)

  const startTest = useCallback(() => {
    const points = generateTestPoints()
    setTestPoints(points)
    setCurrentPointIndex(0)
    setResults({})
    setPhase('testing')
    setShowStimulus(false)
    setAwaitingResponse(false)
  }, [])

  const showNextStimulus = useCallback(() => {
    if (currentPointIndex >= testPoints.length) {
      setPhase('results')
      return
    }

    setShowStimulus(true)
    setAwaitingResponse(true)

    stimulusTimeoutRef.current = setTimeout(() => {
      setShowStimulus(false)
    }, STIMULUS_DURATION)

    responseTimeoutRef.current = setTimeout(() => {
      if (awaitingResponse) {
        setResults(prev => ({
          ...prev,
          [testPoints[currentPointIndex].id]: false
        }))
        setAwaitingResponse(false)
        setCurrentPointIndex(prev => prev + 1)
      }
    }, RESPONSE_TIMEOUT)
  }, [currentPointIndex, testPoints, awaitingResponse])

  const handleResponse = useCallback(() => {
    if (!awaitingResponse || phase !== 'testing') return

    clearTimeout(responseTimeoutRef.current)
    clearTimeout(stimulusTimeoutRef.current)

    setResults(prev => ({
      ...prev,
      [testPoints[currentPointIndex].id]: true
    }))
    setShowStimulus(false)
    setAwaitingResponse(false)
    setCurrentPointIndex(prev => prev + 1)
  }, [awaitingResponse, phase, testPoints, currentPointIndex])

  useEffect(() => {
    if (phase === 'testing' && !awaitingResponse && currentPointIndex < testPoints.length) {
      const delay = setTimeout(() => {
        showNextStimulus()
      }, 500 + Math.random() * 1000)
      return () => clearTimeout(delay)
    }
  }, [phase, awaitingResponse, currentPointIndex, testPoints.length, showNextStimulus])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleResponse()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleResponse])

  useEffect(() => {
    return () => {
      clearTimeout(responseTimeoutRef.current)
      clearTimeout(stimulusTimeoutRef.current)
    }
  }, [])

  const currentPoint = testPoints[currentPointIndex]
  const progress = testPoints.length > 0
    ? Math.round((currentPointIndex / testPoints.length) * 100)
    : 0

  const seenCount = Object.values(results).filter(Boolean).length
  const missedCount = Object.values(results).filter(v => v === false).length

  if (phase === 'setup') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#eee',
        padding: '40px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
            Кампиметрия
          </h1>

          <div style={{
            backgroundColor: '#16213e',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginTop: 0 }}>Настройки теста</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Тестируемый глаз:
              </label>
              <select
                value={testEye}
                onChange={(e) => setTestEye(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#0f3460',
                  color: '#eee'
                }}
              >
                <option value="right">Правый глаз (OD)</option>
                <option value="left">Левый глаз (OS)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Размер стимула: {stimulusSize}px
              </label>
              <input
                type="range"
                min="4"
                max="20"
                value={stimulusSize}
                onChange={(e) => setStimulusSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Цвет стимула:
              </label>
              <input
                type="color"
                value={stimulusColor}
                onChange={(e) => setStimulusColor(e.target.value)}
                style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Цвет фона:
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                style={{ width: '60px', height: '40px', border: 'none', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{
            backgroundColor: '#16213e',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0 }}>Инструкция</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li>Закройте {testEye === 'right' ? 'левый' : 'правый'} глаз</li>
              <li>Смотрите строго на центральную точку фиксации</li>
              <li>Когда увидите вспышку в любом месте экрана, нажмите <kbd style={{
                backgroundColor: '#0f3460',
                padding: '4px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>Пробел</kbd> или кликните мышью</li>
              <li>Не переводите взгляд на вспышку!</li>
            </ol>
          </div>

          <button
            onClick={startTest}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#e94560',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Начать тест
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'testing') {
    return (
      <div
        onClick={handleResponse}
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor,
          position: 'relative',
          cursor: 'crosshair',
          overflow: 'hidden'
        }}
      >
        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4ade80',
            transition: 'width 0.3s'
          }} />
        </div>

        {/* Eye indicator */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '8px 16px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {testEye === 'right' ? 'OD (правый)' : 'OS (левый)'} — {currentPointIndex + 1}/{testPoints.length}
        </div>

        {/* Fixation point */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: FIXATION_SIZE,
          height: FIXATION_SIZE,
        }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#000',
            transform: 'translateX(-50%)'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#000',
            transform: 'translateY(-50%)'
          }} />
        </div>

        {/* Stimulus */}
        {showStimulus && currentPoint && (
          <div style={{
            position: 'absolute',
            left: `${currentPoint.x}%`,
            top: `${currentPoint.y}%`,
            transform: 'translate(-50%, -50%)',
            width: stimulusSize,
            height: stimulusSize,
            borderRadius: '50%',
            backgroundColor: stimulusColor,
            boxShadow: `0 0 ${stimulusSize/2}px ${stimulusColor}`
          }} />
        )}

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(0,0,0,0.5)',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Смотрите на крестик. Нажмите пробел или кликните, когда увидите вспышку.
        </div>
      </div>
    )
  }

  if (phase === 'results') {
    const totalPoints = Object.keys(results).length
    const sensitivityPercent = totalPoints > 0
      ? Math.round((seenCount / totalPoints) * 100)
      : 0

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a2e',
        color: '#eee',
        padding: '40px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
            Результаты кампиметрии
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: '#16213e',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Глаз</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {testEye === 'right' ? 'OD' : 'OS'}
              </div>
            </div>
            <div style={{
              backgroundColor: '#16213e',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Чувствительность</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>
                {sensitivityPercent}%
              </div>
            </div>
            <div style={{
              backgroundColor: '#16213e',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>Пропущено</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171' }}>
                {missedCount}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#16213e',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Карта поля зрения</h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '100%',
              backgroundColor: '#0f3460',
              borderRadius: '50%',
              overflow: 'hidden'
            }}>
              {/* Concentric circles */}
              {[10, 20, 30, 40].map(r => (
                <div key={r} style={{
                  position: 'absolute',
                  left: `${50 - r}%`,
                  top: `${50 - r}%`,
                  width: `${r * 2}%`,
                  height: `${r * 2}%`,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
              ))}

              {/* Cross lines */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '10%',
                bottom: '10%',
                width: '1px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                right: '10%',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }} />

              {/* Center point */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                backgroundColor: '#fff',
                borderRadius: '50%'
              }} />

              {/* Result points */}
              {testPoints.map(point => {
                const seen = results[point.id]
                return (
                  <div
                    key={point.id}
                    style={{
                      position: 'absolute',
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: seen === true ? '#4ade80' : seen === false ? '#f87171' : '#666',
                      border: '2px solid rgba(255,255,255,0.3)'
                    }}
                    title={`(${Math.round(point.x - 50)}°, ${Math.round(point.y - 50)}°) - ${seen ? 'Видит' : 'Не видит'}`}
                  />
                )
              })}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              marginTop: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                <span>Видит ({seenCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#f87171' }} />
                <span>Не видит ({missedCount})</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={() => setPhase('setup')}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '16px',
                backgroundColor: '#0f3460',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Новый тест
            </button>
            <button
              onClick={() => {
                const data = {
                  date: new Date().toISOString(),
                  eye: testEye,
                  sensitivity: sensitivityPercent,
                  seen: seenCount,
                  missed: missedCount,
                  results: results
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `campimetry-${testEye}-${new Date().toISOString().split('T')[0]}.json`
                a.click()
              }}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '16px',
                backgroundColor: '#e94560',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Скачать результаты
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
