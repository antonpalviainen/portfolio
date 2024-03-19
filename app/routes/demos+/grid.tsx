import { useEffect, useId, useRef, useState } from 'react'

function dpi(millimeters: number, dpi = 300) {
  return Math.round(millimeters * (5 / 127) * dpi)
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  start: [number, number],
  end: [number, number]
) {
  ctx.beginPath()
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.closePath()
  ctx.stroke()
}

function Field({
  label,
  inputProps,
}: {
  label: string
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}) {
  const fallbackId = useId()
  const id = inputProps.id ?? fallbackId

  return (
    <div className="table-row">
      <label htmlFor={id} className="table-cell">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className="table-cell max-w-20 ml-3 mb-3 px-0.5 text-black rounded"
      />
    </div>
  )
}

function Grid() {
  const [properties, setProperties] = useState({
    margin: 10,
    step: 20,
    majorColor: '#000000',
    minorColor: '#5e5e5e',
    majorWidth: 5,
    minorWidth: 1,
    dashedMinorLines: false,
    dashInterval: 20,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.height = 3508
    canvas.width = 2480

    const width = ctx.canvas.width
    const height = ctx.canvas.height

    const marginPx = dpi(properties.margin)
    const stepPx = dpi(properties.step)

    // Grid dimensions
    const h = Math.floor((height - 2 * marginPx) / stepPx) * stepPx
    const w = Math.floor((width - 2 * marginPx) / stepPx) * stepPx

    const top = Math.round((height - h) / 2)
    const bottom = top + h
    const left = Math.round((width - w) / 2)
    const right = left + w

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = properties.minorColor
    ctx.lineWidth = properties.minorWidth
    if (properties.dashedMinorLines) {
      ctx.setLineDash([properties.minorWidth, properties.dashInterval])
    }

    // Minor grid
    for (let x = left + Math.round(stepPx / 2); x < right; x += stepPx) {
      drawLine(ctx, [x, top], [x, bottom])
    }

    for (let y = top + Math.round(stepPx / 2); y < bottom; y += stepPx) {
      drawLine(ctx, [left, y], [right, y])
    }

    ctx.strokeStyle = properties.majorColor
    ctx.lineWidth = properties.majorWidth
    ctx.setLineDash([])

    // Major grid
    for (let x = left + stepPx; x < right; x += stepPx) {
      drawLine(ctx, [x, top], [x, bottom])
    }

    for (let y = top + stepPx; y < bottom; y += stepPx) {
      drawLine(ctx, [left, y], [right, y])
    }

    // Outlines
    ctx.strokeRect(left, top, w, h)
  }, [properties])

  function updateProperty(
    e: React.SyntheticEvent<HTMLInputElement>,
    key: keyof typeof properties
  ) {
    const target = e.target as HTMLInputElement
    let value

    switch (target.type) {
      case 'number':
        value = parseInt(target.value)
        break
      case 'checkbox':
        value = target.checked
        break
      default:
        value = target.value
        break
    }

    setProperties({ ...properties, [key]: value })
  }

  async function saveAsPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'grid.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col lg:h-[90vh] lg:flex-row">
      <canvas ref={canvasRef} className="h-full">
        grid
      </canvas>
      <div className="mt-6 ml-6">
        <div className="table">
          <Field
            label="Margin"
            inputProps={{
              type: 'number',
              value: properties.margin,
              min: 0,
              onChange: (e) => updateProperty(e, 'margin'),
            }}
          />
          <Field
            label="Step"
            inputProps={{
              type: 'number',
              value: properties.step,
              onChange: (e) => updateProperty(e, 'step'),
              min: 1,
            }}
          />
          <Field
            label="Major color"
            inputProps={{
              type: 'color',
              value: properties.majorColor,
              onChange: (e) => updateProperty(e, 'majorColor'),
            }}
          />
          <Field
            label="Minor color"
            inputProps={{
              type: 'color',
              value: properties.minorColor,
              onChange: (e) => updateProperty(e, 'minorColor'),
            }}
          />
          <Field
            label="Major width"
            inputProps={{
              type: 'number',
              value: properties.majorWidth,
              min: 1,
              onChange: (e) => updateProperty(e, 'majorWidth'),
            }}
          />
          <Field
            label="Minor width"
            inputProps={{
              type: 'number',
              value: properties.minorWidth,
              min: 1,
              onChange: (e) => updateProperty(e, 'minorWidth'),
            }}
          />
          <Field
            label="Dashed minor lines"
            inputProps={{
              type: 'checkbox',
              checked: properties.dashedMinorLines,
              onChange: (e) => updateProperty(e, 'dashedMinorLines'),
            }}
          />
          <Field
            label="Dash interval"
            inputProps={{
              type: 'number',
              value: properties.dashInterval,
              min: 1,
              disabled: !properties.dashedMinorLines,
              onChange: (e) => updateProperty(e, 'dashInterval'),
            }}
          />
          <button
            onClick={saveAsPng}
            className="w-full rounded bg-[#4d79b3] px-4 py-2 mt-3 text-white hover:bg-[#346ab2] focus:bg-[#6a88af]"
          >
            Export as PNG
          </button>
        </div>
        <div className="mt-12 space-y-3">
          <p>An app for creating printable grids.</p>
          <p>
            <a
              href="https://github.com/antonpalviainen/portfolio/blob/main/app/routes/demos%2B/grid.tsx"
              className="text-[#7896bd] hover:text-[#a6bdd9]"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <Grid />
}
