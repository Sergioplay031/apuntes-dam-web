export type SimulationEvent = {
  line: number
  kind: "initialization" | "condition" | "update" | "output" | "statement"
  description: string
  condition?: string
  conditionResult?: boolean
  variables: Record<string, number>
  output: string[]
}

type LoopHeader = {
  kind: "for" | "while"
  variable: string
  operator: string
  limit: number
  start?: number
  update?: string
}

const conditionPattern = /([A-Za-z_$][\w$]*)\s*(<=|>=|==|!=|<|>)\s*(-?\d+)/

function parseCondition(condition: string) {
  const match = condition.match(conditionPattern)
  if (!match) return null
  return { variable: match[1], operator: match[2], limit: Number(match[3]) }
}

function compare(left: number, operator: string, right: number) {
  switch (operator) {
    case "<": return left < right
    case "<=": return left <= right
    case ">": return left > right
    case ">=": return left >= right
    case "==": return left === right
    case "!=": return left !== right
    default: return false
  }
}

function blockEnd(lines: string[], start: number, end: number) {
  let depth = 0
  for (let index = start; index < end; index++) {
    depth += (lines[index].match(/{/g) || []).length
    depth -= (lines[index].match(/}/g) || []).length
    if (depth === 0) return index
  }
  return end - 1
}

function parseLoopHeader(line: string): LoopHeader | null {
  const forMatch = line.match(/for\s*\(\s*int\s+([A-Za-z_$][\w$]*)\s*=\s*(-?\d+)\s*;\s*([^;]+);\s*([^)]*)\)/)
  if (forMatch) {
    const condition = parseCondition(forMatch[3])
    if (!condition || condition.variable !== forMatch[1]) return null
    return { kind: "for", variable: forMatch[1], start: Number(forMatch[2]), operator: condition.operator, limit: condition.limit, update: forMatch[4].trim() }
  }

  const whileMatch = line.match(/while\s*\(([^)]+)\)/)
  if (whileMatch) {
    const condition = parseCondition(whileMatch[1])
    if (!condition) return null
    return { kind: "while", ...condition }
  }

  return null
}

function applyUpdate(expression: string, variables: Record<string, number>) {
  const update = expression.match(/^([A-Za-z_$][\w$]*)\s*(\+\+|--|\+=\s*-?\d+|-=\s*-?\d+)$/)
  if (!update) return null
  const [, variable, operation] = update
  if (operation === "++") variables[variable] += 1
  else if (operation === "--") variables[variable] -= 1
  else if (operation.startsWith("+=")) variables[variable] += Number(operation.slice(2).trim())
  else variables[variable] -= Number(operation.slice(2).trim())
  return variable
}

function readOutput(expression: string, variables: Record<string, number>) {
  return expression.split("+").map((part) => {
    const value = part.trim()
    if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1)
    if (Object.prototype.hasOwnProperty.call(variables, value)) return String(variables[value])
    return value
  }).join("")
}

export function simulateJavaLoop(source: string): SimulationEvent[] {
  const lines = source.split("\n")
  const events: SimulationEvent[] = []
  const variables: Record<string, number> = {}
  const output: string[] = []
  const maxEvents = 4000
  let exceededLimit = false

  const record = (line: number, kind: SimulationEvent["kind"], description: string, condition?: string, conditionResult?: boolean) => {
    if (events.length >= maxEvents) {
      exceededLimit = true
      return
    }
    events.push({ line: line + 1, kind, description, condition, conditionResult, variables: { ...variables }, output: [...output] })
  }

  const executeRange = (start: number, end: number, depth = 0): number => {
    let index = start
    if (depth > 8 || exceededLimit) return end

    while (index < end && !exceededLimit) {
      const text = lines[index].trim()
      const header = parseLoopHeader(text)

      if (header?.kind === "for") {
        const lastLine = blockEnd(lines, index, end)
        const bodyStart = index + 1
        variables[header.variable] = header.start ?? 0
        record(index, "initialization", `${header.variable} se inicializa con ${header.start}.`)
        let iterations = 0
        while (iterations < 1000 && !exceededLimit) {
          const condition = `${header.variable} ${header.operator} ${header.limit}`
          const result = compare(variables[header.variable], header.operator, header.limit)
          record(index, "condition", result ? "La condición es verdadera; comienza esta iteración." : "La condición es falsa; el bucle termina.", condition, result)
          if (!result) break
          executeRange(bodyStart, lastLine, depth + 1)
          const updated = applyUpdate(header.update || "", variables)
          if (!updated) {
            record(index, "statement", `La actualización «${header.update}» no pertenece al subconjunto del simulador.`)
            break
          }
          record(index, "update", `${updated} se actualiza mediante ${header.update}.`)
          iterations++
        }
        if (iterations >= 1000) exceededLimit = true
        index = lastLine + 1
        continue
      }

      if (header?.kind === "while") {
        const lastLine = blockEnd(lines, index, end)
        let iterations = 0
        while (iterations < 1000 && !exceededLimit) {
          const currentValue = variables[header.variable] ?? 0
          const condition = `${header.variable} ${header.operator} ${header.limit}`
          const result = compare(currentValue, header.operator, header.limit)
          record(index, "condition", result ? "La condición es verdadera; entra en el cuerpo." : "La condición es falsa; termina el while.", condition, result)
          if (!result) break
          const before = events.length
          executeRange(index + 1, lastLine, depth + 1)
          if (events.length === before) break
          iterations++
        }
        if (iterations >= 1000) exceededLimit = true
        index = lastLine + 1
        continue
      }

      const declaration = text.match(/^int\s+([A-Za-z_$][\w$]*)\s*=\s*(-?\d+)\s*;/)
      if (declaration) {
        variables[declaration[1]] = Number(declaration[2])
        record(index, "initialization", `${declaration[1]} se inicializa con ${declaration[2]}.`)
        index++
        continue
      }

      const print = text.match(/^System\.out\.println\((.*)\);$/)
      if (print) {
        output.push(readOutput(print[1], variables))
        record(index, "output", "Se añade una línea a la salida de consola.")
        index++
        continue
      }

      const update = text.match(/^([A-Za-z_$][\w$]*)\s*(\+\+|--|\+=\s*-?\d+|-=\s*-?\d+)\s*;/)
      if (update) {
        const variable = applyUpdate(`${update[1]} ${update[2]}`, variables)
        if (variable) record(index, "update", `${variable} se actualiza en el cuerpo del while.`)
        index++
        continue
      }

      if (text === "}" || text === "{" || text.length === 0 || text.startsWith("public class") || text.includes("static void main")) {
        index++
        continue
      }

      record(index, "statement", "Instrucción sin efecto visible en este simulador.")
      index++
    }

    return index
  }

  executeRange(0, lines.length)
  if (exceededLimit) record(lines.length - 1, "statement", "La simulación se detuvo por alcanzar el límite de seguridad de iteraciones.")
  return events
}
