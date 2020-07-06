import { createContext, useReducer } from 'react'
import { stat } from 'fs'

/**
 * This is the 
 */
interface MatrixTableState {
  /**
   * This is the price matrix that contains the latest value
   */
  matrix: import('../../types').Matrix
  /**
   * We will use original matrix to help us "reset" the table when we want to cancel editing it.
   * Remember that **whenever** you get the matrix from the server, you must set originalMatrix
   * to that value; originalMatrix should try to mirror the matrix in our database.
   */
  originalMatrix: import('../../types').Matrix
}

/**
 * These are the actions you can dispatch. Add actions you want to help you
 * type the dispatch function
 */
type MatrixAction = {
  type: 'SET_MATRIX',
  /**
   * When payload is empty, we will need to set the values from originalMatrix
   */ 
  payload?: import('../../types').Matrix
  metadata?: {
    /**
     * If this is set to true, then instead of resetting to the originalMatrix,
     * we reset to the emptyMatrix
     */
    resetToEmpty?: boolean
  }
} | {
  type: 'SET_ORIGINAL_MATRIX',
  /**
   * When empty, set the value from emptyMatrix
   */
  payload?: import('../../types').Matrix
} | {
  type: 'UPDATE_GRID',
  payload: {
    tenure: string
    package: string
    value: number
  }
} | {
  type: 'MULTIPLY_GRID',
  payload: {
    tenure: string
    scheme: string
    value: number
  }
}

/**
 * This is for the Provider component
 */
type ProviderProps = {
  initialMatrix?: import('../../types').Matrix
}

const emptyMatrix = {
  "36months": {
      "lite": 0,
      "standard": 0,
      "unlimited": 0,
  },
  "24months": {
      "lite": 0,
      "standard": 0,
      "unlimited": 0
  },
  "12months": {
      "lite": 0,
      "standard": 0,
      "unlimited": 0
  },
  "mtm": {
      "lite": 0,
      "standard": 0,
      "unlimited": 0
  }
}

const defaultState: MatrixTableState = {
  matrix: emptyMatrix,
  originalMatrix: emptyMatrix,
}

const reducer = (state: MatrixTableState, action: MatrixAction): MatrixTableState => {
  const temp = {...state.matrix}
  console.log('1st: ', state.matrix === state.originalMatrix)
  switch(action.type) {
    case 'SET_MATRIX':
      console.log('SET_MATRIX ')
      return {
        ...state, matrix: action.payload // work left for reset
      }
      break
    case 'SET_ORIGINAL_MATRIX':
      console.log('SET_ORIGINAL_MATRIX ', action.payload)
      return {
        // matrix: action.payload ? action.payload : emptyMatrix,
        originalMatrix: action.payload ? action.payload : emptyMatrix
      }
      break
    case 'UPDATE_GRID':
      console.log('UPDATE_GRID')
      temp[action.payload.tenure][action.payload.scheme] = Number(action.payload.value)
      return {
        ...state,
        matrix: temp
      }
      break
    case 'CANCEL_MATRIX':
      return {
        ...state, matrix: state.originalMatrix
      }
    default:
      return state
  }
}

export const MatrixTableContext = createContext<[MatrixTableState, import('react').Dispatch<MatrixAction>]>(defaultState)

/**
 * This is the provider that hosts the state
 * @param param0 
 */
export const MatrixTableContextProvider: import('react').FC<ProviderProps> = ({ initialMatrix, children }) => {
  console.log('provider calling?', initialMatrix)
  const state = useReducer(reducer, { matrix: initialMatrix || emptyMatrix, originalMatrix: initialMatrix || emptyMatrix })
  console.log('^^^ ', JSON.stringify(state))
  return (
    <MatrixTableContext.Provider value={state}>
      {children}
    </MatrixTableContext.Provider>
  )
}